import axios from '../../api/axios';

export const fetchNotifications = async (userId, setNotifications) => {
  try {
    const response = await axios.post('/fetch-notifications', { user_id: userId });
    const sortedNotifications = response.data.notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(sortedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

export const markAsSeen = async (notificationId, notifications, setNotifications) => {
  try {
    const response = await axios.post('/mark-notification-seen', { notification_id: notificationId });
    if (response.data.message === 'Notification marked as seen') {
      setNotifications(
        notifications.map(notification =>
          notification._id === notificationId ? { ...notification, seen: true } : notification
        )
      );
    }
  } catch (error) {
    console.error('Error marking notification as seen:', error);
  }
};
