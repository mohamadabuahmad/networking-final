import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useUser } from './UserContext';

function NotificationsPage() {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.post('/fetch-notifications', { user_id: currentUser.user_id });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const markAsSeen = async (notificationId) => {
    try {
      await axios.post('/mark-as-seen', { notification_id: notificationId });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, seen: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  return (
    <div className="flex-grow p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl mb-6">Notifications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Notification</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id}>
                <td className={`py-2 px-4 border-b ${notification.seen ? 'text-gray-500' : 'font-bold'}`}>
                  {notification.notification_content}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {!notification.seen && (
                    <button
                      onClick={() => markAsSeen(notification._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 focus:outline-none"
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
    </div>
  );
}

export default NotificationsPage;
