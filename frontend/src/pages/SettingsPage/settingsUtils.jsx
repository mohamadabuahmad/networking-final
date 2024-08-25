import axios from '../../api/axios';

export const fetchUserData = async (userId, setUserData, setError) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    setUserData(response.data);
  } catch (error) {
    setError('Error fetching user data');
    console.error('Error fetching user data:', error);
  }
};

export const fetchUserSkills = async (userId, setSkills, setError) => {
  try {
    const response = await axios.post('/fetch-skills', { user_id: userId });
    setSkills(response.data.skills);
  } catch (error) {
    setError('Error fetching user skills');
    console.error('Error fetching user skills:', error);
  }
};

export const handleEditClick = async (field, userData, setUserData, editingField, setEditingField, currentUser, setError) => {
  if (editingField === field) {
    try {
      const response = await axios.post('/update-user', {
        user_id: currentUser.user_id,
        field,
        value: userData[field],
      });
      if (response.data.success) {
        setUserData({ ...userData, [field]: response.data.value });
        setEditingField('');
      } else {
        setError('Failed to update user data');
      }
    } catch (error) {
      setError('Error updating user data');
      console.error('Error updating user data:', error);
    }
  } else {
    setEditingField(field);
  }
};

export const handleInputChange = (e, field, userData, setUserData) => {
  setUserData({ ...userData, [field]: e.target.value });
};

export const handleSkillChange = (e, setNewSkill) => {
  setNewSkill(e.target.value);
};

export const addSkill = async (newSkill, setSkills, skills, currentUser, setNewSkill, setError) => {
  if (newSkill.trim() !== '') {
    try {
      const response = await axios.post('/add-skill', { user_id: currentUser.user_id, skill: newSkill });
      if (response.data.success) {
        setSkills([...skills, newSkill]);
        setNewSkill('');
      } else {
        setError('Failed to add skill');
      }
    } catch (error) {
      setError('Error adding skill');
      console.error('Error adding skill:', error);
    }
  }
};

export const removeSkill = async (skillToRemove, setSkills, skills, currentUser, setError) => {
  try {
    const response = await axios.post('/remove-skill', { user_id: currentUser.user_id, skill: skillToRemove });
    if (response.data.success) {
      setSkills(skills.filter(skill => skill !== skillToRemove));
    } else {
      setError('Failed to remove skill');
    }
  } catch (error) {
    setError('Error removing skill');
    console.error('Error removing skill:', error);
  }
};
