import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './CommentsSidebar.css';

const CommentsSidebar = ({ title, content, onClose }) => {
  const [enrichedContent, setEnrichedContent] = useState([]);

  useEffect(() => {
    console.log(content);
    const fetchUsername = async (userId) => {
      try {
        const response = await axios.get(`/user/${userId}`);
        return response.data.user_name;
      } catch (error) {
        console.error('Error fetching username:', error);
        return 'Unknown User';
      }
    };

    const enrichContent = async () => {
      const enriched = await Promise.all(
        content.map(async (item) => {
          let username;

          if (title === 'Comments') {
            username = await fetchUsername(item.user_id);
          } else {
            username = await fetchUsername(item.user);
          }

          return { ...item, username };
        })
      );
      setEnrichedContent(enriched);
    };

    enrichContent();
  }, [content]);

  return (
    <div className="sidebar-overlay">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">{title}</h2>
          <button onClick={onClose} className="sidebar-close-button">Close</button>
        </div>
        <div className="sidebar-content">
          {enrichedContent.map((item, index) => (
            <div key={index} className="sidebar-item">
              <strong>{item.username}:</strong> {item.comment_content || 'Liked'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsSidebar;
