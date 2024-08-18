import React, { useState, useEffect } from 'react';
import { 
    enrichPostsData, 
    fetchUsername, 
    addPost as addPostUtility, 
    addLike, 
    removeLike, 
    addComment, 
    deleteComment 
} from './homepageutilities.jsx';

import './HomePage.css';
import CommentsSidebar from '../CommentSidebar/CommentsSidebar.jsx';
import { useUser } from '../UserContext.jsx';
import axios from '../../api/axios.jsx';

function HomePage() {
    const { currentUser } = useUser();
    const [posts, setPosts] = useState([]);
    const [postContent, setPostContent] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [sidebarContent, setSidebarContent] = useState([]);
    const [sidebarTitle, setSidebarTitle] = useState('');
    const [message, setMessage] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Add state for sidebar

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
            document.documentElement.classList.add(savedTheme);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        const newTheme = darkMode ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/fetch-data');
                const { posts, comments, likes } = response.data;
                const enrichedPosts = await enrichPostsData(posts, comments, likes);
                setPosts(enrichedPosts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const addPost = async () => {
        const success = await addPostUtility(currentUser, postContent, posts, setPosts, setMessage);
        if (success) {
            setPostContent('');
        }
    };

    const showComments = (comments) => {
        setSidebarContent(comments);
        setSidebarTitle('Comments');
        setShowSidebar(true);
    };

    const showLikes = (likes) => {
        setSidebarContent(likes);
        setSidebarTitle('Likes');
        setShowSidebar(true);
    };

    return (
        <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <h1 className="title">Welcome to the Home Page</h1>
            <button
                onClick={toggleDarkMode}
                className={`button ${darkMode ? 'dark-mode-button' : 'light-mode-button'}`}
            >
                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>

            <div>
                {message && <p>{message}</p>}
                <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="What's on your mind?"
                />
                <button
                    onClick={addPost}
                    className="button bg-blue-600 text-white mt-2"
                >
                    Post
                </button>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <div
                        key={post.post_id}
                        className={`post-container ${darkMode ? 'dark-mode' : 'light-mode'}`}
                    >
                        <h2 className="post-title">{post.username}</h2>
                        <p className="post-content">{post.post_content}</p>
                        <div className="flex flex-wrap space-x-4">
                            <span
                                onClick={() => showLikes(post.likes)}
                                className="cursor-pointer text-blue-500 hover:underline"
                            >
                                Likes: {post.likes.length}
                            </span>
                            <span
                                onClick={() => showComments(post.comments)}
                                className="cursor-pointer text-blue-500 hover:underline"
                            >
                                Comments: {post.comments.length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {showSidebar && (
                <CommentsSidebar
                    title={sidebarTitle}
                    content={sidebarContent}
                    onClose={() => setShowSidebar(false)}
                />
            )}
        </div>
    );
}

export default HomePage;
