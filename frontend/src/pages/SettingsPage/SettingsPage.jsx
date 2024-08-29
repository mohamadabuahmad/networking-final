/*import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import {
  fetchUserData,
  fetchUserSkills,
  handleEditClick,
  handleInputChange,
  handleSkillChange,
  addSkill,
  removeSkill,
  handleImageChange,
} from './settingsUtils';
import './SettingsPage.css';
import axios from '../../api/axios';

const SettingsPage = () => {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState({});
  const [editingField, setEditingField] = useState(''); // Ensure this state is defined
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    fetchUserData(currentUser.user_id, setUserData, setError);
    fetchUserSkills(currentUser.user_id, setSkills, setError);
  }, [currentUser.user_id]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('user_id', currentUser.user_id);

      try {
        const response = await axios.post('/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          setUserData({ ...userData, photo: response.data.photo });
          setEditingField('');
        } else {
          setError('Failed to upload photo');
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
        setError('Error uploading photo');
      }
    }
  };

  const renderFieldValue = (value) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="settings-section">
        <h2 className="settings-subtitle">User Data</h2>
        <div className="settings-grid">
          {Object.entries(userData).map(([field, value]) => (
            field !== '_id' && (
              <div key={field} className="settings-field-container">
                <div className="settings-field-title">
                  <h3>{field}</h3>
                  <button
                    onClick={() => handleEditClick(field, userData, setUserData, editingField, setEditingField, currentUser, setError)}
                    className="settings-button"
                  >
                    {editingField === field ? 'Done' : 'Edit'}
                  </button>
                </div>
                <div className="mt-2">
                  {editingField === field ? (
                    field === 'photo' ? (
                      <input
                        type="file"
                        onChange={handlePhotoUpload}
                        className="settings-field-input"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(e, field, userData, setUserData)}
                        className="settings-field-input"
                      />
                    )
                  ) : (
                    field === 'photo' ? (
                      <img src={value} alt="Profile" className="profile-photo" />
                    ) : (
                      <p>{renderFieldValue(value)}</p>
                    )
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Skills Section (unchanged) }
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
*/

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
  handleImageChange,
} from './settingsUtils';
import axios from '../../api/axios';

const SettingsPage = () => {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState({});
  const [editingField, setEditingField] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    setLoading(true); // Start loading
    fetchUserData(currentUser.user_id, setUserData, setError).finally(() => setLoading(false));
    fetchUserSkills(currentUser.user_id, setSkills, setError);
  }, [currentUser.user_id]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('user_id', currentUser.user_id);

      try {
        const response = await axios.post('/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          setUserData({ ...userData, photo: response.data.photo });
          setEditingField('');
        } else {
          setError('Failed to upload photo: ' + response.data.message);
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
        setError('Error uploading photo: ' + err.message);
      }
    }
  };

  const renderFieldValue = (value) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  const handleSaveChanges = () => {
    // Logic to handle save changes if needed
    setEditingField('');
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {loading && <p>Loading...</p>} {/* Show loading state */}
      {error && <p className="error-message">{error}</p>}

      <div className="settings-section">
        <h2 className="settings-subtitle">User Data</h2>
        <div className="settings-grid">
          {Object.entries(userData).map(([field, value]) => (
            field !== '_id' && (
              <div key={field} className="settings-field-container">
                <div className="settings-field-title">
                  <h3>{field}</h3>
                  <button
                    onClick={() => handleEditClick(field, userData, setUserData, editingField, setEditingField, currentUser, setError)}
                    className="settings-button"
                  >
                    {editingField === field ? 'Done' : 'Edit'}
                  </button>
                </div>
                <div className="mt-2">
                  {editingField === field ? (
                    field === 'photo' ? (
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="settings-field-input"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(e, field, userData, setUserData)}
                        className="settings-field-input"
                      />
                    )
                  ) : (
                    field === 'photo' ? (
                      <img src={value} alt="Profile" className="profile-photo" />
                    ) : (
                      <p>{renderFieldValue(value)}</p>
                    )
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Skills Section */}
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
