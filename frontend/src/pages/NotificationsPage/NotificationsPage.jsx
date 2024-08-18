import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { fetchNotifications, markAsSeen } from './notificationsUtils';
import './NotificationsPage.css';

function NotificationsPage() {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    fetchNotifications(currentUser.user_id, setNotifications);
  }, [currentUser]);

  const handleMarkAsSeen = (notificationId) => {
    markAsSeen(notificationId, notifications, setNotifications);
  };

  if (!currentUser) {
    return <div>Loading...</div>; // Or a loading indicator
  }

  return (
    <div className="notifications-page-container">
      <h1 className="notifications-page-title">Notifications</h1>
      <table className="notifications-page-table">
        <thead>
          <tr>
            <th>Notification Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map(notification => (
            <tr key={notification._id}>
              <td className={`notifications-page-content ${!notification.seen ? 'notifications-page-content-unseen' : ''}`}>
                {notification.notification_content}
              </td>
              <td>
                {!notification.seen && (
                  <button
                    onClick={() => handleMarkAsSeen(notification._id)}
                    className="notifications-page-button"
                  >
                    Mark as Seen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NotificationsPage;
