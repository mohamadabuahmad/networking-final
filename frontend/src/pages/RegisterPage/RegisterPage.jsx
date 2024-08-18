import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import {
  handleChange,
  handleSkillChange,
  addSkill,
  handleQuestionChange,
  handleNext,
  handleRegister,
  questionOptions,
} from './registerUtils';
import './RegisterPage.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    password: '',
    phone_number: '',
    education: '',
    photo: '',
    skills: [],
    recovery_q1: { question: '', answer: '' },
    recovery_q2: { question: '', answer: '' }
  });
  const [skill, setSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Register</h1>
        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}
        {step === 1 && (
          <form>
            <div className="register-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Education</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Photo URL</label>
              <input
                type="text"
                name="photo"
                value={formData.photo}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleNext(step, setStep, formData, setError)}
              className="register-button"
            >
              Next
            </button>
          </form>
        )}
        {step === 2 && (
          <div>
            <h2 className="register-title">Your Skills</h2>
            <table className="skills-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.skills.map((skill, index) => (
                  <tr key={index}>
                    <td>{skill}</td>
                    <td></td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(e, setSkill)}
                      placeholder="Skill"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => addSkill(skill, formData, setFormData, setSkill, setError)}
                      className="add-skill-button"
                    >
                      Add Skill
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => handleNext(step, setStep, formData, setError)}
              className="register-button"
            >
              Next
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="register-title">Recovery Questions</h2>
            <div className="register-field">
              <label>Question 1</label>
              <select
                name="recovery_q1.question"
                value={formData.recovery_q1.question}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
              >
                <option value="" disabled>Select a question</option>
                {questionOptions.filter(q => q !== formData.recovery_q2.question).map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                name="recovery_q1.answer"
                value={formData.recovery_q1.answer}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
                placeholder="Answer"
                required
              />
            </div>
            <div className="register-field">
              <label>Question 2</label>
              <select
                name="recovery_q2.question"
                value={formData.recovery_q2.question}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
              >
                <option value="" disabled>Select a question</option>
                {questionOptions.filter(q => q !== formData.recovery_q1.question).map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                name="recovery_q2.answer"
                value={formData.recovery_q2.answer}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
                placeholder="Answer"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleRegister(formData, setCurrentUser, setSuccess, setError, navigate)}
              className="register-button"
            >
              Finish Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
