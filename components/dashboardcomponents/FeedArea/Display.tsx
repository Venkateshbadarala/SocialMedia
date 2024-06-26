import React from 'react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  createdAt?: Date;
}

interface DisplayProps {
  comments: Comment[];
}

const Display: React.FC<DisplayProps> = ({ comments }) => {
  const defaultAvatar = "/images/default-avatar.png"; // Path to your default avatar image

  return (
    <div className="mt-4">
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-100 p-2 rounded-lg mb-2 flex items-start">
          <img
            src={comment.userImage || defaultAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <p className="text-gray-800 text-xl">{comment.text}</p>
            <p className="text-sm text-gray-500">By User: {comment.userName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Display;
