"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  image?: string;
}

interface UserListProps {
  sendFriendRequest: (receiverId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ sendFriendRequest }) => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user?.id) return;

      try {
        setLoadingUsers(true);
        const url = `/api/requests/getAllUsers`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
        setErrorUsers(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setErrorUsers('Error fetching users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [session]);

  if (loadingUsers) {
    return <div>Loading users...</div>;
  }

  if (errorUsers) {
    return <div>{errorUsers}</div>;
  }

  return (
    <div>
     {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="">
          {users.map((user) => (
            <li key={user.id} className=" rounded p-4 flex items-center justify-start gap-4 bg-slate-600">
              <div className="flex items-center mb-2">
                {user.image && <img src={user.image} alt={user.name} className="rounded-full mr-2" width={50} height={50} />}
                <span className="text-lg font-semibold">{user.name}</span>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => sendFriendRequest(user.id)}>Follow</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
