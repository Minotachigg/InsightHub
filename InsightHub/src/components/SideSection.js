import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiBookmarkPlus } from "react-icons/ci";
import { API } from '../config';
import axios from 'axios';
import ProfileIcon from './ProfileIcon';

const SideSection = () => {
    const [topics, setTopics] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios.get(`${API}/bloglist`)
            .then(res => {
                const latestBlogs = res.data
                    .slice(0, 3);
                setBlogs(latestBlogs);
            })
            .catch(err => {
                console.error("Error fetching blogs:", err);
            });
    }, []);

    useEffect(() => {
        axios.get(`${API}/topiclist`)
            .then(res => {
                const randomTopics = res.data
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 7);
                setTopics(randomTopics);
            })
            .catch(err => {
                console.error("Error fetching topics:", err);
            });
    }, []);


    return (
        <>
            <div className="container mt-3 px-0">
                <div className="row mb-4">
                    {/* Latest Section */}
                    <div className="col-12">
                        <h5 className="mb-3">Latest</h5>
                        <div className="mb-3">
                            {blogs.map((blog, i) => (
                                <Link to={`/blog/${blog._id}`} key={i} className="mb-3 text-dark">
                                    <div className='d-flex align-items-center gap-1 mb-1'>
                                        <ProfileIcon name={blog.author.name} style={{ fontSize: '10px', width: '1rem', height: '1rem' }} />
                                        <span className="d-block text-muted" style={{ fontSize: '12px' }}>{blog.author.name}</span>
                                    </div>
                                    <h5 className='fs-6'>{blog.title}</h5>
                                    <p style={{ fontSize: '12px', color: 'gray' }}>{new Date(blog.date).toLocaleDateString('en-GB', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row my-4 me-4">
                    {/* Recommended Topics Section */}
                    <div className="col-12">
                        <h5 className="mb-4">Recommended topics</h5>
                        <div className="rec-topics d-flex flex-wrap gap-3 mb-3">
                            {topics.map((topic, i) => (
                                <button key={i} className="btn-sm">
                                    {topic.topic_name}
                                </button>
                            ))}
                        </div>
                        <div className="mb-2">
                            <Link to="/exploretopics" className="text-decoration-none" style={{ fontSize: '15px', color: 'gray' }}>See more topics</Link>
                        </div>
                    </div>
                </div>

                {/* Info Text */}
                <div className="alert alert-info">
                    <span>Click the <CiBookmarkPlus className='fs-4' /> on any story to easily add it to your reading list or a custom list that you can share.</span>
                </div>
            </div>
        </>
    );
};

export default SideSection;
