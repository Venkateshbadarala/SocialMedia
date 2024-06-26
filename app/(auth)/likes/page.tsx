import React from 'react';
import UserList from '@/components/dashboardcomponents/Request/UserList';

// Define the User interface
interface User {
  id: string;
  name: string;
  image?: string;
}

// Define the PageProps interface with users and sendFriendRequest
interface PageProps {
  users: User[];
  sendFriendRequest: (receiverId: string) => void;
}

// Define the Page component with PageProps
const Page: React.FC<PageProps> = ({ users, sendFriendRequest }) => {
  return (
    <div>
      <h1>User List</h1>
      <UserList users={users} sendFriendRequest={sendFriendRequest} />
    </div>
  );
};

export default Page;
