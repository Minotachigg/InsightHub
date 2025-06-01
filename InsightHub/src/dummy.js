import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API } from '../config';
import Header from '../components/Header';
import { isAuthenticated } from '../auth';
import { toast, ToastContainer } from 'react-toastify';

const Write = () => {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [topicList, setTopicList] = useState([]);
    const contentBoxRef = useRef(null);
    const fileInputRef = useRef();
    const [fileQueue, setFileQueue] = useState([]);

    const { user } = isAuthenticated();

    const handleSubmitRef = useRef(null);

    // Fetch topics when the component is mounted
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get(`${API}/topiclist`);  // Adjust API endpoint accordingly
                setTopicList(response.data);
                if (response.data.length > 0 && !topic) {
                    setTopic("");  // Set the first topic as default
                }
            } catch (err) {
                console.error("Error fetching topics:", err);
            }
        };
        fetchTopics();
    }, [topic]);

    // Handle form submission when submitBlog event is triggered
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        console.log("Submitting blog...");
        console.log("Title state value:", `"${title}"`);

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

        console.log("Title:", title);
        console.log("Selected Topic:", topic);
        console.log("Author ID:", user?._id);
        console.log("File Queue:", fileQueue);
        console.log("Content Box HTML:", contentBoxRef.current.innerHTML);


        let fileIndex = 0;

        for (let node of children) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) contentData.push({ type: 'text', value: text });
            } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                const text = node.innerText.trim();
                if (text) contentData.push({ type: 'text', value: text });
            } else if (node.nodeName === 'IMG') {
                contentData.push({ type: 'file' });
                fileIndex++;
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

        try {
            await axios.post(`${API}/createblog`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Blog posted successfully!');
            contentBox.innerHTML = '';
            setTitle('');
            setTopic('');
            setFileQueue([]);
        } catch (err) {
            console.error(err);
            toast.error('Error posting blog');
        }
    };

    useEffect(() => {
        handleSubmitRef.current = handleSubmit;
    }, [title, topic, fileQueue]); // watch state

    // Listen for the custom submitBlog event
    useEffect(() => {
        const handleCustomSubmit = (e) => {
            if (handleSubmitRef.current) {
                handleSubmitRef.current(e);
            }
        };

        window.addEventListener("submitBlog", handleCustomSubmit);
        return () => {
            window.removeEventListener("submitBlog", handleCustomSubmit);
        };
    }, []);


    // Handle file input changes (when a file is selected)
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the selected file

        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create a local URL for the file
            const imgElement = `<img src="${imageUrl}" class="img-fluid" style="max-width: 100%; height: auto; border-radius: 8px;" />`;  // Image tag with styling

            // Add the image to the content box
            const contentBox = contentBoxRef.current;
            contentBox.innerHTML += imgElement;

            // Update the file queue state
            setFileQueue((prev) => [...prev, file]);
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
                            onChange={(e) => {
                                console.log("Selected topic:", e.target.value);
                                setTopic(e.target.value);
                            }}
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
                            onChange={handleFileChange} // Handle file change here
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default Write;
