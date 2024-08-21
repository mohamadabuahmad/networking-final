import React, { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import axios from '../api/axios';
import { useUser } from './UserContext';

const MessagingPage = () => {
  const { currentUser } = useUser();
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistories, setChatHistories] = useState({});

  const websocketUrl = `wss://chat-server-networking-197a435521f1.herokuapp.com/`;
  const messageInputRef = useRef(null);

  const { sendMessage, readyState } = useWebSocket(
    selectedUser ? websocketUrl : null,
    {
      onOpen: () => {
        console.log('WebSocket connection opened');
        if (selectedUser) {
          fetchChatHistory(selectedUser._id);
        }
      },
      onClose: () => console.log('WebSocket connection closed'),
      onMessage: (message) => {
        console.log('Received message:', message);

        if (message.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result;
            try {
              const messageData = JSON.parse(text);
              if (messageData.sender_id === selectedUser?._id) {
                appendMessageToHistory(messageData.sender_id, messageData);
              }
            } catch (error) {
              console.error('Error parsing message from Blob:', error);
            }
          };
          reader.readAsText(message.data);
        } else if (typeof message.data === 'string') {
          try {
            const messageData = JSON.parse(message.data);
            if (messageData.sender_id === selectedUser?._id) {
              appendMessageToHistory(messageData.sender_id, messageData);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        }
      },
    }
  );

  useEffect(() => {
    if (currentUser) {
      const fetchFriends = async () => {
        try {
          const response = await axios.post('/fetch-friends', { user_id: currentUser.user_id });
          setFriends(response.data.friends);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      };
      fetchFriends();
    }
  }, [currentUser]);

  const searchUsers = async () => {
    try {
      const response = await axios.post('/search-users', { username: searchUsername });
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const startChat = (user) => {
    setSelectedUser(user);
    if (!chatHistories[user._id]) {
      fetchChatHistory(user._id);
    }
  };

  const fetchChatHistory = async (userId) => {
    setChatHistories(prev => ({ ...prev, [userId]: [] }));
  };

  const appendMessageToHistory = (userId, messageData) => {
    setChatHistories(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), messageData]
    }));
  };

  const handleSendMessage = () => {
    const messageInput = messageInputRef.current.value;
    const messageData = {
      sender_id: currentUser.user_id,
      receiver_id: selectedUser._id,
      message: messageInput,
      sender: 'You'
    };

    sendMessage(JSON.stringify(messageData));
    appendMessageToHistory(selectedUser._id, messageData);
    messageInputRef.current.value = '';
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* First Column: Search and Friends List */}
      <div className="w-full sm:w-1/3 p-4 bg-gray-100">
        {/* Search Users Section */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Search Users</h2>
          <div className="flex mb-4">
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter username"
              className="flex-grow p-2 border rounded"
            />
            <button onClick={searchUsers} className="bg-blue-600 text-white px-4 py-2 rounded ml-2">Search</button>
          </div>
          {searchResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map(user => (
                    <tr key={user.user_id}>
                      <td className="py-2 px-4 border-b">{user.user_name}</td>
                      <td className="py-2 px-4 border-b flex space-x-2">
                        <button
                          onClick={() => startChat(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Chat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Friends List Section */}
        <div>
          <h2 className="text-2xl mb-4">Friends</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {friends.map(friend => (
                  <tr key={friend.user_id}>
                    <td className="py-2 px-4 border-b">{friend.user_name}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button
                        onClick={() => startChat(friend)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Second Column: Chat Area */}
      <div className="w-full sm:w-2/3 p-4">
        {selectedUser ? (
          <div>
            <h2 className="text-2xl mb-4">Chat with {selectedUser.user_name}</h2>
            <div className="border p-4 h-full">
              {/* Chat content */}
              <div className="overflow-y-auto max-h-64">
                {(chatHistories[selectedUser._id] || []).map((msg, index) => (
                  <p key={`${msg.sender_id}-${index}`}>
                    {msg.sender_id === currentUser.user_id ? 'You' : selectedUser.user_name}: {msg.message}
                  </p>
                ))}
              </div>

              <input 
                type="text" 
                ref={messageInputRef} 
                placeholder="Type your message" 
                className="p-2 border rounded w-full mb-2" 
              />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
            </div>
          </div>
        ) : (
          <p>Select a user to start chatting</p>
        )}
        <div className="mt-4">
          Connection status: {connectionStatus}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
