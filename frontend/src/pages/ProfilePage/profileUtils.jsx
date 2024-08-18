import axios from '../../api/axios';

export const fetchUserDetails = async (userId, setUser, setError) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    setUser(response.data);
  } catch (err) {
    setError('Error fetching user details');
    console.error('Error fetching user details:', err);
  }
};
