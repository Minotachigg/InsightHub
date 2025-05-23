import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API, IMG_URL } from '../config';
import { isAuthenticated } from '../auth';
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { toast, ToastContainer } from 'react-toastify';

const UserWorks = () => {
    const [userBlogs, setUserBlogs] = useState([]) || []; // State to hold user's blogs
    const { user, token } = isAuthenticated(); // Get authenticated user and token

    // Fetch blogs created by the user
    useEffect(() => {
        if (user && user._id) {
            axios.get(`${API}/blogs/user/${user._id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    setUserBlogs(res.data); // Set blogs when response is successful
                })
                .catch((err) => {
                    if (err.response && err.response.status === 404) {
                        setUserBlogs([]); // Handle case when no blogs exist
                    } else {
                        console.error(err); // Log other errors
                        console.log('Failed to fetch your blogs');
                    }
                });
        }
    }, [user._id, token]); // Only trigger effect when `user._id` or `token` changes

    const handleDelete = (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            axios.delete(`${API}/deleteblog/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    setUserBlogs(userBlogs.filter(blog => blog._id !== blogId)); // Remove deleted blog from state
                    toast.success('Blog deleted successfully!');
                })
                .catch((err) => {
                    console.error(err); // Log error if deletion fails
                    alert('Failed to delete the blog');
                });
        }
    }

    return (
        <>
            <ToastContainer position='bottom-right' theme='colored' />
            <div>
                {userBlogs.length > 0 ? (
                    userBlogs.map((blog, i) => {

                        const firstImage = blog.content.find(item => item.files_url)?.files_url;
                        const previewText = blog.content.find(item => item.content_text)?.content_text || '';

                        return (
                            <div key={i} className="border-bottom py-4">
                                <div className="row g-3">
                                    <div className='d-flex justify-content-between align-content-center'>
                                        <div className="col-md-12">
                                            <Link to={`/blog/${blog._id}`} className="text-decoration-none text-dark d-flex">
                                                <div className='col-md-8 px-2'>
                                                    <h5 className="fw-bold">{blog.title}</h5>
                                                    <p className="text-muted">
                                                        {previewText.length > 100 ? previewText.slice(0, 100) + '...' : previewText}
                                                    </p>
                                                </div>
                                                <div className="col-md-4 d-flex align-items-center justify-content-end">
                                                    {firstImage && (
                                                        <img
                                                            src={`${IMG_URL}/${firstImage}`}
                                                            alt="Blog Preview"
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                                                        />
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="col-md-7 px-3 d-flex justify-content-between text-muted small">
                                                <span>
                                                    {new Date(blog.date).toLocaleDateString('en-GB', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>

                                                <div className="dropdown">
                                                    <span
                                                        className="btn btn-link p-0"
                                                        type="button"
                                                        id="dropdownMenuButton"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <PiDotsThreeOutlineFill size={25} style={{ color: '#000000' }} title='Options' />
                                                    </span>

                                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                                        <li><Link className="dropdown-item text-success" to={`/edit/${blog._id}`}>Edit</Link></li>
                                                        <li><button className="dropdown-item text-danger" onClick={() => handleDelete(blog._id)}>Delete</button></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })

                ) : (
                    <p className="text-center m-5 text-muted">You haven't written any blogs yet.</p>
                )}

            </div>
        </>
    );
};

export default UserWorks;
