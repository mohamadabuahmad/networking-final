// MessageUtilities.jsx

import axios from '../../api/axios';

export const fetchFriends = async (userId, setFriends) => {
  try {
    const response = await axios.post('/fetch-friends', { user_id: userId });
    setFriends(response.data.friends);
    console.log('Fetched friends:', response.data.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
};

export const fetchChatHistory = async (userId, setChatHistories) => {
  setChatHistories((prev) => ({ ...prev, [userId]: [] }));
  // Fetch chat history from the server here if needed
};

export const appendMessageToHistory = (userId, messageData, setChatHistories) => {
  setChatHistories(prev => ({
    ...prev,
    [userId]: [...(prev[userId] || []), messageData],
  }));
};



export const handleSendMessage = (currentUser, selectedUser, sendMessage, appendMessageToHistory, setChatHistories) => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  const messageData = {
    sender_id: currentUser.user_id,
    receiver_id: selectedUser._id,
    message,
    sender: 'You',
  };
 
  sendMessage(JSON.stringify(messageData));
  appendMessageToHistory(selectedUser._id, messageData, setChatHistories);
  messageInput.value = '';
};

export const searchUsers = async (searchUsername, setSearchResults) => {
  try {
    const response = await axios.post('/search-users', { username: searchUsername });
    setSearchResults(response.data.users);
  } catch (error) {
    console.error('Error searching users:', error);
  }
};

export const startChat = (user, setSelectedUser, fetchChatHistory, setChatHistories, chatHistories) => {
  setSelectedUser(user);

  // Ensure chatHistories is defined and contains the user ID
  if (!chatHistories || !chatHistories[user._id]) {
      fetchChatHistory(user._id, setChatHistories);
  } else {
      console.log('Chat history already exists:', chatHistories[user._id]);
  }
};

export const processWebSocketData = (
  message,
  selectedUser,
  currentUser,
  appendMessageToHistory,
  setChatHistories
) => {
  // Check if the message data is a Blob
  if (message.data instanceof Blob) {
    const reader = new FileReader();
    reader.onload = function() {
      try {
        const textData = reader.result;
        const data = JSON.parse(textData);

        // Ensure data is from the selected user
        if (data.sender_id === selectedUser._id) {
          appendMessageToHistory(data.sender_id, data, setChatHistories);
          console.log('Message appended to history:', data);
        } else {
          console.warn('Received message from a different user:', data.sender_id);
        }
      } catch (error) {
        console.error('Error parsing message from Blob:', error);
      }
    };
    reader.readAsText(message.data);
  } else if (typeof message.data === 'string') {
    // If the data is a string, parse it directly
    try {
      const data = JSON.parse(message.data);

      if (data.sender_id === selectedUser._id) {
        appendMessageToHistory(data.sender_id, data, setChatHistories);
        console.log('Message appended to history:', data);
      } else {
        console.warn('Received message from a different user:', data.sender_id);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  } else {
    console.error('Unexpected WebSocket message format:', message.data);
  }
};

