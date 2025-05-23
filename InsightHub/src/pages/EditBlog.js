import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API, IMG_URL } from '../config';
import Header from '../components/Header';
import { isAuthenticated } from '../auth';
import { toast, ToastContainer } from 'react-toastify';
import { useParams, useNavigate, NavLink } from 'react-router-dom';

const EditBlog = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [topicList, setTopicList] = useState([]);
    const contentBoxRef = useRef(null);
    const fileInputRef = useRef();
    const [fileQueue, setFileQueue] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const { user } = isAuthenticated();

    // Fetch topics and blog data
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get(`${API}/topiclist`);
                setTopicList(response.data);
            } catch (err) {
                console.error("Error fetching topics:", err);
            }
        };
        fetchTopics();
    }, []);

    // Fetch blog data for editing
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${API}/blogdetails/${blogId}`);
                setTitle(res.data.title);
                setTopic(res.data.topic?._id || '');
                // Convert content array to HTML for editing
                if (contentBoxRef.current && Array.isArray(res.data.content)) {
                    const tempExistingImages = [];
                    const html = res.data.content.map(block => {
                        if (block.content_text) {
                            return `<p>${block.content_text}</p>`;
                        } else if (block.files_url) {
                            tempExistingImages.push(block.files_url);
                            return `<img src="${IMG_URL}/${block.files_url}" class="img-fluid" style="max-width: 100%; height: auto; border-radius: 8px;" />`;
                        } else {
                            return '';
                        }
                    }).join('');
                    setExistingImages(tempExistingImages);
                    contentBoxRef.current.innerHTML = html;
                }
            } catch (err) {
                toast.error('Failed to load blog for editing');
            }
        };
        fetchBlog();
    }, [blogId]);

    // Handle file input changes (when a file is selected)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const imgElement = `<img src="${imageUrl}" class="img-fluid" style="max-width: 100%; height: auto; border-radius: 8px;" />`;
            const contentBox = contentBoxRef.current;
            contentBox.innerHTML += imgElement;
            setFileQueue((prev) => [...prev, file]);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (window.confirm('Are you sure you want to update this blog?')) {

            const contentBox = contentBoxRef.current;
            const contentText = contentBox.innerText.trim();
            const children = Array.from(contentBox.childNodes);
            const contentData = [];

            if (!title || !title.trim()) {
                toast.error("Title cannot be empty.");
                return;
            }
            if (!topic || !topic.trim()) {
                toast.error("Please select a topic.");
                return;
            }
            if (!contentText) {
                toast.error("Content cannot be empty.");
                return;
            }

            let fileIndex = 0;
            for (let node of children) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent.trim();
                    if (text) contentData.push({ type: 'text', value: text });
                } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                    const text = node.innerText.trim();
                    if (text) contentData.push({ type: 'text', value: text });
                } else if (node.nodeName === 'IMG') {
                    const src = node.getAttribute('src');
                    if (src.startsWith('blob:')) {
                        // New image
                        contentData.push({ type: 'file' });
                    } else if (src.startsWith(IMG_URL)) {
                        // Existing image
                        const files_url = src.replace(`${IMG_URL}/`, '');
                        contentData.push({ files_url });
                    }
                }
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('topic', topic);
            formData.append('author', user?._id || '');

            for (let file of fileQueue) {
                formData.append('files', file);
            }

            formData.append('content_data', JSON.stringify(contentData));
            formData.append('content_html', contentBox.innerHTML);

            try {
                await axios.put(`${API}/updateblog/${blogId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Blog updated successfully!');
                setTimeout(() => navigate(`/blog/${blogId}`), 1000);
            } catch (err) {
                console.error(err);
                toast.error('Error updating blog');
            }
        }
    };

    return (
        <>
            <ToastContainer position='bottom-right' theme="colored" />
            <Header isWritePage={true} user={user} />
            <div className="container mt-4" style={{ maxWidth: '1000px' }}>
                <form onSubmit={handleSubmit}>
                    {/* Topic Dropdown */}
                    <div className="form-group mb-4 w-25 position-relative">
                        <label htmlFor="topic" className="text-muted position-absolute fst-italic" style={{ left: '-3rem', top: '50%', transform: 'translateY(-50%)' }}>
                            Topic
                        </label>
                        <select
                            id="topic"
                            className="form-control ms-5"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a topic</option>
                            {topicList.map((item) => (
                                <option key={item._id} value={item._id}> 
                                    {item.topic_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title Input */}
                    <div className="form-group mb-4 position-relative">
                        <label htmlFor="title" className="text-muted position-absolute fst-italic" style={{ left: '-50px', top: '50%', transform: 'translateY(-50%)' }}>
                            Title
                        </label>
                        <textarea
                            id="title"
                            className="form-control title-box form-control-lg px-5 border-0 border-bottom"
                            placeholder="Title Here..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={100}
                            rows={2}
                            style={{ resize: 'none', overflow: 'hidden' }}
                        ></textarea>
                    </div>

                    {/* Content Box */}
                    <div className="form-group mb-4 position-relative">
                        <label htmlFor="content" className="text-muted position-absolute fst-italic" style={{ left: '-6rem', top: '0%', transform: 'translateY(-50%)' }}>
                            Content Start
                        </label>
                        <div
                            id='content'
                            className="content-box form-control px-5 border-0"
                            contentEditable
                            ref={contentBoxRef}
                            data-placeholder="Tell your story..."
                            style={{
                                minHeight: '20px',
                                padding: '10px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                borderRadius: '8px',
                                position: 'relative',
                            }}
                        ></div>
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="d-flex gap-2 mb-3 sticky-top py-2" style={{ zIndex: 10 }}>
                        <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => fileInputRef.current.click()}>
                            + Add Image
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className='my-3 py-3 text-center border-top'>

                        <button className="btn btn-primary" type="submit">Update Blog</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditBlog;