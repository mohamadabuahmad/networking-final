import axios from '../../api/axios';

export const fetchSecurityQuestions = async (email) => {
  try {
    const response = await axios.post('/forgot-password', { email });
    if (response.data.questions) {
      return { questions: response.data.questions, error: null };
    } else {
      return { questions: null, error: 'Email not found.' };
    }
  } catch (error) {
    return { questions: null, error: 'Error retrieving recovery questions.' };
  }
};

export const verifyAnswers = async (email, answers) => {
  try {
    const response = await axios.post('/verify-answers', { email, answers });
    if (response.data.correct) {
      return { correct: true, error: null };
    } else {
      return { correct: false, error: 'Incorrect answers. Please try again.' };
    }
  } catch (error) {
    return { correct: false, error: 'Error verifying answers.' };
  }
};
