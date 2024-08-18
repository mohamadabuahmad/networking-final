import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useUser } from '../pages/UserContext';

const SettingsPage = () => {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState({});
  const [editingField, setEditingField] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/${currentUser.user_id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserSkills = async () => {
      try {
        const response = await axios.post('/fetch-skills', { user_id: currentUser.user_id });
        setSkills(response.data.skills);
      } catch (error) {
        console.error('Error fetching user skills:', error);
      }
    };

    fetchUserData();
    fetchUserSkills();
  }, [currentUser.user_id]);

  const handleEditClick = (field) => {
    if (editingField === field) {
      const updateData = async () => {
        try {
          const response = await axios.post('/update-user', { user_id: currentUser.user_id, field, value: userData[field] });
          setUserData({ ...userData, [field]: response.data.value });
          setEditingField('');
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      };
      updateData();
    } else {
      setEditingField(field);
    }
  };

  const handleInputChange = (e, field) => {
    setUserData({ ...userData, [field]: e.target.value });
  };

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const addSkill = async () => {
    if (newSkill.trim() !== '') {
      try {
        await axios.post('/add-skill', { user_id: currentUser.user_id, skill: newSkill });
        setSkills([...skills, newSkill]);
        setNewSkill('');
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    }
  };

  const removeSkill = async (skillToRemove) => {
    try {
      await axios.post('/remove-skill', { user_id: currentUser.user_id, skill: skillToRemove });
      setSkills(skills.filter(skill => skill !== skillToRemove));
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const renderFieldValue = (value) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
      <h1 className="text-2xl sm:text-3xl mb-4 sm:mb-6">Settings</h1>
      
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl mb-4">User Data</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(userData).map(([field, value]) => (
            field !== '_id' && (
              <div key={field} className="p-4 border rounded bg-gray-100 dark:bg-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{field}</h3>
                  <button
                    onClick={() => handleEditClick(field)}
                    className="bg-blue-500 text-white px-3 py-1 rounded dark:bg-blue-700"
                  >
                    {editingField === field ? 'Done' : 'Edit'}
                  </button>
                </div>
                <div className="mt-2">
                  {editingField === field ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, field)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
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

      <div>
        <h2 className="text-xl sm:text-2xl mb-4">Skills</h2>
        <div className="grid gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="p-4 border rounded bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
              <p>{skill}</p>
              <button
                onClick={() => removeSkill(skill)}
                className="bg-red-500 text-white px-3 py-1 rounded dark:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="p-4 border rounded bg-gray-100 dark:bg-gray-700">
            <input
              type="text"
              value={newSkill}
              onChange={handleSkillChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white mb-2"
              placeholder="New Skill"
            />
            <button
              onClick={addSkill}
              className="bg-green-500 text-white px-3 py-1 rounded dark:bg-green-700"
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
