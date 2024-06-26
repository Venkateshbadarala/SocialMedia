// Import necessary libraries
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ProfileForm component
const ProfileForm: React.FC = () => {
    // State variables
    const [imageSrc, setImageSrc] = useState<string>("https://placehold.co/300x300.png");
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    // Session hook to get current user session
    const { data: session } = useSession();

    // Handle image change event
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            setImageSrc(URL.createObjectURL(e.target.files[0]));
        }
    };

    // Handle form submit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedImage || '');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        try {
            // Make POST request to update profile
            await axios.post(`/api/users/profile?id=${session?.user?.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Display success message using toast notification
            toast.success("Profile updated successfully.");
        } catch (error) {
            // Display error message in case of failure
            console.error(error);
            toast.error("Error updating profile. Please try again.");
        }
    };

    // JSX return
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <ToastContainer /> {/* Toast notifications container */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 rounded">
                {/* Profile picture upload */}
                <div className="flex flex-col items-center gap-5">
                    <label htmlFor="profilePic" className="text-gray-600">PROFILE PIC</label>
                    <img
                        src={imageSrc}
                        alt="User Avatar"
                        height={112}
                        width={112}
                        className="h-28 w-28 rounded-full border-4 border-gray-200"
                        onError={() => setImageSrc("https://placehold.co/300x300.png")}
                    />
                    <input type="file" id="profilePic" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <label htmlFor="profilePic" className="cursor-pointer bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:bg-blue-600 transition duration-300 ease-in-out">Upload Image</label>
                </div>
                {/* Input fields for name, email, and password */}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-96 h-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-96 h-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-96 h-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Submit button */}
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ProfileForm;
