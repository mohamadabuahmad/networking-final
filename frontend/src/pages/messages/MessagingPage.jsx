import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import useWebSocket from 'react-use-websocket';
import ReadyState from 'react-use-websocket';
import {
  fetchFriends,
  fetchChatHistory,
  appendMessageToHistory,
  handleSendMessage,
  searchUsers,
  startChat,
  processWebSocketData,
} from './MessageUtilities';
import './MessagingPage.css';

const MessagingPage = () => {
  const { currentUser } = useUser();
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistories, setChatHistories] = useState({});  // Ensure chatHistories is initialized as an empty object

  const { sendMessage, readyState } = useWebSocket(
    selectedUser ? `wss://chat-server-networking-197a435521f1.herokuapp.com/` : null,
    {
      onOpen: () => {
        console.log('WebSocket connection opened');
        if (selectedUser) {
          fetchChatHistory(selectedUser._id, setChatHistories);
        }
      },
      onClose: () => console.log('WebSocket connection closed'),
      onMessage: (message) => {
        processWebSocketData(message, selectedUser, currentUser, appendMessageToHistory, setChatHistories);
      },
    }
  );



  useEffect(() => {
    if (currentUser) {
      fetchFriends(currentUser.user_id, setFriends);
    }
  }, [currentUser]);

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
    <div className="messaging-container">
      <div className="sidebar">
        <div className="search-section">
          <h2>Search Users</h2>
          <div className="search-input">
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter username"
            />
            <button onClick={() => searchUsers(searchUsername, setSearchResults)}>Search</button>
          </div>
          {searchResults.length > 0 && (
            <table className="search-results">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((user) => (
                  <tr key={user._id}>
                    <td>{user.user_name}</td>
                    <td>
                      <button
                        className="chat-button"
                        onClick={() => startChat(user, setSelectedUser, fetchChatHistory, setChatHistories, chatHistories)}
                      >
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="friends-section">
          <h2>Friends</h2>
          {friends.length > 0 ? (
            <table className="friends-list">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((friend) => (
                  <tr key={friend.user_id}>
                    <td>{friend.user_name}</td>
                    <td>
                      <button
                        className="chat-button"
                        onClick={() => startChat(friend, setSelectedUser, fetchChatHistory, setChatHistories, chatHistories)}
                      >
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No friends found.</p>
          )}
        </div>
      </div>

      <div className="chat-area">
        {selectedUser ? (
          <div>
            <h2>Chat with {selectedUser.user_name}</h2>
            <div className="chat-content">
              {(chatHistories[selectedUser._id] || []).map((msg, index) => (
                <p key={`${msg.sender_id}-${index}`}>
                  {msg.sender_id === currentUser.user_id ? 'You' : selectedUser.user_name}: {msg.message}
                </p>
              ))}
            </div>
            <input type="text" id="messageInput" placeholder="Type your message" />
            <button
              onClick={() =>
                handleSendMessage(currentUser, selectedUser, sendMessage, appendMessageToHistory, setChatHistories)
              }
            >
              Send
            </button>
          </div>
        ) : (
          <p>Select a user to start chatting</p>
        )}
        <div>Connection status: {connectionStatus}</div>
      </div>
    </div>
  );
};

export default MessagingPage;
