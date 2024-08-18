import axios from '../../api/axios';

export const fetchFriends = async (userId) => {
  try {
    const response = await axios.post('/fetch-friends', { user_id: userId });
    return response.data.friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
};

export const fetchFollowers = async (userId) => {
  try {
    const response = await axios.post('/fetch-followers', { friend_id: userId });
    return response.data.followers;
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
};

export const removeFollow = async (currentUser, friendId) => {
  try {
    const response = await axios.post('/remove-follow', { user_id: currentUser.user_id, friend_id: friendId });
    return response.data.message === 'Friend removed successfully';
  } catch (error) {
    console.error('Error removing friend:', error);
    return false;
  }
};

export const removeFollower = async (currentUser, followerId) => {
  try {
    const response = await axios.post('/remove-follower', { user_id: currentUser.user_id, follower_id: followerId });
    return response.data.message === 'Follower removed successfully';
  } catch (error) {
    console.error('Error removing follower:', error);
    return false;
  }
};

export const followUser = async (currentUser, userId) => {
  try {
    const response = await axios.post('/follow', { user_id: currentUser.user_id, friend_id: userId });
    if (response.data.message === 'Friend added successfully') {
      const notificationContent = `${currentUser.user_name} started to follow you`;
      await axios.post('/add-follow-notification', { user_id: userId, notification_content: notificationContent });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding friend:', error);
    return false;
  }
};

export const searchUsers = async (username) => {
  try {
    const response = await axios.post('/search-users', { username });
    return response.data.users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};
