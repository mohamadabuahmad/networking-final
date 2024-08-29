import React, { useState, useEffect } from 'react';
import { 
    enrichPostsData, 
    addPost as addPostUtility,
    addLike,
    removeLike,
    addComment
} from './homepageutilities.jsx';


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
    const [commentContents, setCommentContents] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const [skip, setSkip] = useState(0); // Track number of posts already loaded
    const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts to load

    const limit = 5; // Number of posts to fetch per request

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
            document.documentElement.classList.add(savedTheme);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchPosts();
    }, [currentUser]);

    const fetchPosts = async () => {
        if (!hasMorePosts) return;

        try {
            const response = await axios.get('/fetch-data', {
                params: {
                    userId: currentUser.user_id,
                    limit,
                    skip
                }
            });

            const { posts, comments, likes } = response.data;
            const enrichedPosts = await enrichPostsData(posts, comments, likes);
            setPosts(prevPosts => [...prevPosts, ...enrichedPosts]);

            // Update likedPosts state based on initial data
            const userLikes = likes.reduce((acc, like) => {
                if (like.user === currentUser.user_id) {
                    acc[like.post_id] = true;
                }
                return acc;
            }, {});
            setLikedPosts(userLikes);

            if (posts.length < limit) {
                setHasMorePosts(false); // No more posts to load
            }

            setSkip(prevSkip => prevSkip + limit);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Add a new post
    const addPost = async () => {
        const success = await addPostUtility(currentUser, postContent, posts, setPosts, setMessage);
        if (success) {
            setPostContent('');
        }
    };

    // Handle like/unlike action
    const handleLikeToggle = async (postId) => {
        if (likedPosts[postId]) {
            await removeLike(postId, currentUser, posts, setPosts);
            setLikedPosts(prev => ({ ...prev, [postId]: false }));
        } else {
            await addLike(postId, currentUser, posts, setPosts);
            setLikedPosts(prev => ({ ...prev, [postId]: true }));
        }
    };

    // Add a comment to a post
    const handleAddComment = async (postId) => {
        if (commentContents[postId]?.trim()) {
            await addComment(postId, commentContents[postId], currentUser, posts, setPosts);
            setCommentContents(prev => ({ ...prev, [postId]: '' }));
        }
    };

    // Handle comment content change
    const handleCommentChange = (postId, content) => {
        setCommentContents(prev => ({ ...prev, [postId]: content }));
    };

    // Show comments sidebar
    const showComments = (comments) => {
        setSidebarContent(comments);
        setSidebarTitle('Comments');
        setShowSidebar(true);
    };

    // Show likes sidebar
    const showLikes = (likes) => {
        setSidebarContent(likes);
        setSidebarTitle('Likes');
        setShowSidebar(true);
    };

    return (
        <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <h1 className="title">Welcome to Your Professional Network</h1>


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
            <br></br>

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
                        <div className="flex flex-col mt-4 space-y-4 items-start">
                            <div className="flex-grow w-full">
                                <textarea
                                    value={commentContents[post.post_id] || ''}
                                    onChange={(e) => handleCommentChange(post.post_id, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out"
                                    placeholder="Add a comment..."
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleLikeToggle(post.post_id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
                                >
                                    {likedPosts[post.post_id] ? 'Unlike' : 'Like'}
                                </button>
                                <button
                                    onClick={() => handleAddComment(post.post_id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
                                >
                                    Comment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMorePosts && (
                <button onClick={fetchPosts} className="load-more-button mt-4">
                    Load More
                </button>
            )}

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
