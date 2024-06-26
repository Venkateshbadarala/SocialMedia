"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import UserList from './UserList';
import FriendRequestList from './FriendRequestList';
import Message from './Message';

interface User {
  id: string;
  name: string;
  image?: string;
}

interface FriendRequest {
  senderId: string;
  senderName: string;
  senderImage?: string;
}

const RequestPage: React.FC = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/requests/getAllUsers'); // Adjust endpoint to fetch all users
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch users');
        }
        setUsers(response.data.users);
        setLoadingUsers(false);
        setErrorUsers(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setErrorUsers('Error fetching users');
        setLoadingUsers(false);
      }
    };

    if (session?.user?.id) {
      fetchUsers();
    }
  }, [session]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`/api/requests/getRequest?userId=${session?.user?.id}`);
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch friend requests');
        }
        setFriendRequests(response.data.friendRequests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    if (session?.user?.id) {
      fetchFriendRequests();
    }
  }, [session]);

  const sendFriendRequest = async (receiverId: string) => {
    try {
      const senderId = session?.user?.id;
      if (!senderId) {
        throw new Error('User ID not found in session');
      }
      const response = await axios.post('/api/requests/postRequest', { senderId, receiverId });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error sending friend request:', error);
      setMessage('Error sending friend request');
    }
  };

  const handleFriendRequest = async (senderId: string, action: 'accept' | 'cancel') => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error('User ID not found in session');
      }
      const response = await axios.put('/api/requests/putRequest', { userId, senderId, action });
      setMessage(response.data.message);

      if (action === 'accept' || action === 'cancel') {
        setFriendRequests(prevRequests => prevRequests.filter(request => request.senderId !== senderId));
      }
    } catch (error) {
      console.error(`Error ${action === 'accept' ? 'accepting' : 'canceling'} friend request:`, error);
      setMessage(`Error ${action === 'accept' ? 'accepting' : 'canceling'} friend request`);
    }
  };

  if (loadingUsers) {
    return <div>Loading users...</div>;
  }

  if (errorUsers) {
    return <div>{errorUsers}</div>;
  }

  return (
    <div>
      <h1>Requests</h1>
      <Message message={message} />
      <UserList users={users} sendFriendRequest={sendFriendRequest} />
      {friendRequests.length > 0 && (
        <FriendRequestList friendRequests={friendRequests} handleFriendRequest={handleFriendRequest} />
      )}
    </div>
  );
};

export default RequestPage;
