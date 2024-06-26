// components/CommentDrawer.tsx
import * as React from "react";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import axios from "axios";

interface CommentButtonProps {
  postId: string;
  initialCommentCount: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  createdAt?: Date;
}

const CommentDrawer: React.FC<CommentButtonProps> = ({ postId, initialCommentCount }) => {
  const CommentIcon = "/images/icons/chat-bubble.png";
  const { data: session } = useSession();
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [text, setText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const SendIcon = "/images/icons/send.png";
  const DownIcon = "/images/icons/chevron.png";

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/posts/commentbox?id=${postId}`);
      if (response.status === 200) {
        const fetchedComments: Comment[] = response.data.comments.map((comment: any) => ({
          id: comment._id,
          userId: comment.userId,
          userName: comment.userName,
          text: comment.text,
          userImage: comment.userImage,
          createdAt: new Date(comment.createdAt),
        }));
        setComments(fetchedComments);
      } else {
        throw new Error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleComment = async () => {
    if (!session?.user?.id || !text.trim()) return;

    try {
      const response = await axios.post(
        `/api/posts/comment?id=${postId}`, 
        { userId: session.user.id, text } 
      );

      if (response.status === 200) {
        const { commentCount: newCommentCount } = response.data;
        setCommentCount(newCommentCount);
        setText(''); // Clear the comment input field
        fetchComments(); // Fetch updated comments after posting
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="comment-drawer">
      <div className="comment-icon" onClick={toggleModal}>
        <Image 
          src={CommentIcon} 
          height={30} 
          width={30} 
          alt='Comment Icon'
          className="invert" 
        />
      </div>
      {showModal && (
        <div className="fixed inset-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-black p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button className="absolute -top-3 left-2/4 " onClick={toggleModal}>
              <Image 
                src={DownIcon} 
                height={30} 
                width={30} 
                alt='Comment Icon'
                className="invert" 
              />
            </button>
            <h2 className="text-2xl mb-4">Comments</h2>
            {comments.length > 0 ? (
              <div className="comments-container overflow-y-auto max-h-60 mb-4 no-scrollbar">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment flex items-start mb-4 p-2 rounded bg-slate-900">
                    {comment.userImage && (
                      <Image 
                        src={comment.userImage} 
                        height={40} 
                        width={40} 
                        alt={`${comment.userName}'s profile`} 
                        className="rounded-full mr-4"
                      />
                    )}
                    <div className="comment-content ">
                      <p className="comment-user font-semibold">{comment.userName}</p>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No comments yet.</p>
            )}
            <div className="flex items-center justify-center relative">
              <input 
                className="w-full border border-gray-300 rounded p-2 mb-2"
                placeholder="Add a comment..." 
                value={text}
                onChange={(e) => setText(e.target.value)} 
              />
              <button
                className="absolute text-white p-3 rounded invert right-1 -top-1"
                onClick={handleComment}
              >
                <Image 
                  src={SendIcon} 
                  height={25} 
                  width={25} 
                  alt='Comment Icon' 
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentDrawer;
