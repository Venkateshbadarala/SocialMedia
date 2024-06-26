"use client"
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Regular } from '@/components/Navbar/CreatePost/uploader'; // Adjust path as per your directory structure

const DialogDemo: React.FC = () => {
  const { data: session } = useSession();
  const [post, setPost] = useState({
    caption: "",
    photos: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (imageUrls: string[]) => {
    setPost({ ...post, photos: imageUrls });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      if (!session || !session.user) {
        throw new Error("User is not authenticated");
      }

      console.log("Post Data:", post); // Log the post data before sending
      const response = await axios.post(
        `/api/posts/postupload?id=${session.user.id}`,
        post,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Data:", response.data); // Log the response data after receiving
      // Handle success or do something after upload
      setShowModal(false); // Close modal after successful upload
      toast.success("Post uploaded successfully");
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error("Error uploading post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="relative bg-black rounded-lg shadow-lg w-full max-w-md p-6 border">
            <div className="absolute top-0 right-0 mt-4 mr-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.293 5.293a1 1 0 0 1 1.414 1.414l-8 8a1 1 0 0 1-1.414 0l-8-8a1 1 0 1 1 1.414-1.414L10 12.586l4.293-4.293a1 1 0 0 1 1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="pb-6">
              <h2 className="text-lg font-bold mb-4">Make a Post</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="caption" className=" font-medium">
                    Caption
                  </label>
                  <textarea
                    id="caption"
                    value={post.caption}
                    onChange={(e) => setPost({ ...post, caption: e.target.value })}
                    placeholder="Write your caption here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label className=" font-medium">Upload</label>
                  
                  <Regular onImageChange={handleImageChange} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md focus:outline-none"
      >
        POST
      </button>
      <ToastContainer />
    </>
  );
};

export default DialogDemo;
