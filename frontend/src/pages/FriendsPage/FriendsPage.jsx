import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import {
  fetchFriends,
  fetchFollowers,
  removeFollow,
  removeFollower,
  followUser,
  searchUsers,
} from './friendsUtils';
import './FriendsPage.css';

function FriendsPage() {
  const { currentUser } = useUser();
  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const initializeFriendsAndFollowers = async () => {
      setFriends(await fetchFriends(currentUser.user_id));
      setFollowers(await fetchFollowers(currentUser.user_id));
    };

    initializeFriendsAndFollowers();
  }, [currentUser]);

  const handleRemoveFollow = async (friendId) => {
    if (await removeFollow(currentUser, friendId)) {
      setMessage('Friend removed successfully');
      setFriends(await fetchFriends(currentUser.user_id));
    } else {
      setMessage('Failed to remove friend');
    }
  };

  const handleRemoveFollower = async (followerId) => {
    if (await removeFollower(currentUser, followerId)) {
      setMessage('Follower removed successfully');
      setFollowers(await fetchFollowers(currentUser.user_id));
    } else {
      setMessage('Failed to remove follower');
    }
  };

  const handleFollowUser = async (userId) => {
    if (await followUser(currentUser, userId)) {
      setMessage('Friend added successfully');
      setFriends(await fetchFriends(currentUser.user_id));
      setFollowers(await fetchFollowers(currentUser.user_id));
    }
  };

  const handleSearchUsers = async () => {
    setSearchResults(await searchUsers(searchUsername));
  };

  const visitProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (!currentUser) {
    return <div>Loading...</div>; // Or a loading indicator
  }

  return (
    <div className="friends-page-container">
      <h1 className="friends-page-title">Friends</h1>

      {message && <p className={message.includes('successfully') ? 'message-success' : 'message-error'}>{message}</p>}

      {/* Section 1: Search */}
      <div className="friends-page-section">
        <h2 className="friends-page-subtitle">Search</h2>
        <div className="friends-page-search-container">
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Enter username"
            className="friends-page-input"
          />
          <button onClick={handleSearchUsers} className="friends-page-button">Search</button>
        </div>
        {searchResults.length > 0 && (
          <table className="friends-page-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map(user => (
                <tr key={user._id}>
                  <td>{user.user_name}</td>
                  <td>
                    <button
                      onClick={() => handleFollowUser(user._id)}
                      className="action-button"
                    >
                      Follow
                    </button>
                    <button
                      onClick={() => visitProfile(user._id)}
                      className="action-button"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 2: Following */}
      <div className="friends-page-section">
        <h2 className="friends-page-subtitle">Following</h2>
        <table className="friends-page-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {friends.map(friend => (
              <tr key={friend._id}>
                <td>{friend.user_name}</td>
                <td>
                  <button
                    onClick={() => handleRemoveFollow(friend._id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => visitProfile(friend._id)}
                    className="action-button"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 3: Followers */}
      <div className="friends-page-section">
        <h2 className="friends-page-subtitle">Followers</h2>
        <table className="friends-page-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {followers.map(follower => (
              <tr key={follower._id}>
                <td>{follower.user_name}</td>
                <td>
                  <button
                    onClick={() => handleRemoveFollower(follower._id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => visitProfile(follower._id)}
                    className="action-button"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FriendsPage;
