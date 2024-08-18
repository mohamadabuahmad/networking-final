import axios from '../../api/axios';

export const loginUser = async (formData, setCurrentUser, setAuth, navigate, setError) => {
  try {
    const response = await axios.post('/login', formData);
    if (response.data.message === 'Login successful') {
      setAuth(true);
      setCurrentUser(response.data.user);
      navigate('/home');
    } else {
      setError('Invalid credentials');
    }
  } catch (error) {
    setError('Invalid credentials');
  }
};

export const handleInputChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
