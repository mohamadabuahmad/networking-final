import axios from '../../api/axios';

export const handleChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

export const handleSkillChange = (e, setSkill) => {
  setSkill(e.target.value);
};

export const addSkill = (skill, formData, setFormData, setSkill, setError) => {
  if (skill.trim() !== '' && !formData.skills.includes(skill.trim())) {
    setFormData({ ...formData, skills: [...formData.skills, skill.trim()] });
    setSkill('');
  } else if (formData.skills.includes(skill.trim())) {
    setError('Duplicate skill. Please add a different skill.');
  }
};

export const handleQuestionChange = (e, formData, setFormData) => {
  const { name, value } = e.target;
  if (name.startsWith('recovery_q1')) {
    setFormData({ ...formData, recovery_q1: { ...formData.recovery_q1, [name.split('.')[1]]: value } });
  } else if (name.startsWith('recovery_q2')) {
    setFormData({ ...formData, recovery_q2: { ...formData.recovery_q2, [name.split('.')[1]]: value } });
  }
};

export const handleNext = (step, setStep, formData, setError) => {
  if (step === 1 && formData.username && formData.first_name && formData.last_name && formData.gender && formData.email && formData.password && formData.phone_number && formData.education && formData.photo) {
    setStep(step + 1);
  } else if (step === 2) {
    setStep(step + 1);
  } else {
    setError('Please fill out all required fields');
  }
};

export const handleRegister = async (formData, setCurrentUser, setSuccess, setError, navigate) => {
  if (formData.recovery_q1.question && formData.recovery_q1.answer && formData.recovery_q2.question && formData.recovery_q2.answer) {
    try {
      const response = await axios.post('/register', formData);
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setCurrentUser(response.data.user);
      navigate('/home');
    } catch (error) {
      console.error('Error from backend:', error.response ? error.response.data : error.message);
      setError('Error registering user');
      setSuccess('');
    }
  } else {
    setError('Please fill out all required fields');
  }
};

export const questionOptions = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What was your favorite food as a child?",
  "What city were you born in?"
];
