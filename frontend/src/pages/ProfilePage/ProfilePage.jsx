import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../UserContext';
import { fetchUserDetails } from './profileUtils';
import './ProfilePage.css';

function ProfilePage() {
  const { currentUser } = useUser();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDetails(userId, setUser, setError);
  }, [userId]);

  if (error) {
    return <div className="profile-page-error">{error}</div>;
  }

  if (!user) {
    return <div className="profile-page-loading">Loading...</div>;
  }

  return (
    <div className="profile-page-container">
      <h1 className="profile-page-title">Profile Page</h1>
      {user.photo && <img src={user.photo} alt={`${user.user_name}'s profile`} className="profile-page-photo" />}
      <p className="profile-page-info"><strong>User Name:</strong> {user.user_name}</p>
      <p className="profile-page-info"><strong>First Name:</strong> {user.first_name}</p>
      <p className="profile-page-info"><strong>Last Name:</strong> {user.last_name}</p>
      <p className="profile-page-info"><strong>Email:</strong> {user.email}</p>
      <p className="profile-page-info"><strong>Phone Number:</strong> {user.phone_number}</p>
      <p className="profile-page-info"><strong>Education:</strong> {user.education}</p>
      <p className="profile-page-info"><strong>Gender:</strong> {user.gender}</p>
    </div>
  );
}

export default ProfilePage;
