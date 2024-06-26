// FriendRequestList.tsx
import React from 'react';

interface FriendRequest {
  senderId: string;
  senderName: string;
  senderImage?: string;
}

interface FriendRequestListProps {
  friendRequests: FriendRequest[];
  handleFriendRequest: (senderId: string, action: 'accept' | 'cancel') => void;
}

const FriendRequestList: React.FC<FriendRequestListProps> = ({ friendRequests, handleFriendRequest }) => {
  return (
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.map(request => (
          <li key={request.senderId}>
            <div>
              {request.senderImage && <img src={request.senderImage} alt={request.senderName} width={50} height={50} />}
              <span>{request.senderName}</span>
            </div>
            <div>
              <button onClick={() => handleFriendRequest(request.senderId, 'accept')}>Accept</button>
              <button onClick={() => handleFriendRequest(request.senderId, 'cancel')}>Cancel</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequestList;
