import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import {
  fetchUserData,
  fetchUserSkills,
  handleEditClick,
  handleInputChange,
  handleSkillChange,
  addSkill,
  removeSkill,
} from './settingsUtils';
import './SettingsPage.css';

const SettingsPage = () => {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState({});
  const [editingField, setEditingField] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData(currentUser.user_id, setUserData, setError);
    fetchUserSkills(currentUser.user_id, setSkills, setError);
  }, [currentUser.user_id]);

  const renderFieldValue = (value) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-section">
        <h2 className="settings-subtitle">User Data</h2>
        <div className="settings-grid">
          {Object.entries(userData).map(([field, value]) => (
            field !== '_id' && (
              <div key={field} className="settings-field-container">
                <div className="settings-field-title">
                  <h3>{field}</h3>
                  <button
                    onClick={() => handleEditClick(field, userData, setUserData, setEditingField, currentUser, setError)}
                    className="settings-button"
                  >
                    {editingField === field ? 'Done' : 'Edit'}
                  </button>
                </div>
                <div className="mt-2">
                  {editingField === field ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, field, userData, setUserData)}
                      className="settings-field-input"
                    />
                  ) : (
                    <p>{renderFieldValue(value)}</p>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-subtitle">Skills</h2>
        <div className="skills-container">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <p>{skill}</p>
              <button
                onClick={() => removeSkill(skill, setSkills, skills, currentUser, setError)}
                className="skill-button"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="add-skill-container">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => handleSkillChange(e, setNewSkill)}
              className="add-skill-input"
              placeholder="New Skill"
            />
            <button
              onClick={() => addSkill(newSkill, setSkills, skills, currentUser, setNewSkill, setError)}
              className="add-skill-button"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
