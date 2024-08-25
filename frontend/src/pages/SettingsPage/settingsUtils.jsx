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
      let valueToUpdate = userData[field];

      // Check if the field being edited is the photo
      if (field === 'photo' && valueToUpdate instanceof File) {
        // Prepare form data for the image upload
        const formData = new FormData();
        formData.append('photo', valueToUpdate);
        formData.append('user_id', currentUser.user_id);

        // Upload the image to the server
        const uploadResponse = await axios.post('/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Use the URL of the uploaded image as the new value to update
        valueToUpdate = uploadResponse.data.photoUrl;
      }

      // Update the user data with the new value (photo URL or other field value)
      const response = await axios.post('/update-user', {
        user_id: currentUser.user_id,
        field,
        value: valueToUpdate,
      });

      if (response.data.success) {
        setUserData({ ...userData, [field]: response.data.value });
        setEditingField('');  // End editing mode after successful update
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error updating user data');
      console.error('Error updating user data:', error);
    }
  } else {
    setEditingField(field);  // Enter editing mode
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
      await axios.post('/add-skill', { user_id: currentUser.user_id, skill: newSkill });
      setSkills([...skills, newSkill]);
      setNewSkill('');
    } catch (error) {
      setError('Error adding skill');
      console.error('Error adding skill:', error);
    }
  }
};

export const removeSkill = async (skillToRemove, setSkills, skills, currentUser, setError) => {
  try {
    await axios.post('/remove-skill', { user_id: currentUser.user_id, skill: skillToRemove });
    setSkills(skills.filter(skill => skill !== skillToRemove));
  } catch (error) {
    setError('Error removing skill');
    console.error('Error removing skill:', error);
  }
};
export const handleImageChange = (event, setFormData, setError) => {
  const file = event.target.files[0];

  // Validate file type and size
  if (file && (file.type.startsWith('image/'))) {
    // Optional: Check file size (e.g., limit to 2MB)
    if (file.size <= 2 * 1024 * 1024) {
      setFormData(prevFormData => ({
        ...prevFormData,
        photo: file
      }));
      setError(null); // Clear any previous error
    } else {
      setError('File size should be less than 2MB');
    }
  } else {
    setError('Please select a valid image file');
  }
};
