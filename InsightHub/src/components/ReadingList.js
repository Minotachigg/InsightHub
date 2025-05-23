import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API, IMG_URL } from '../config';
import { isAuthenticated } from '../auth';
import { GoBookmarkSlashFill } from "react-icons/go";
import { toast, ToastContainer } from 'react-toastify';

const BookmarkedBlogs = () => {
    const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]) || []; // State to hold user's bookmarked blogs
    const { user, token } = isAuthenticated(); // Get authenticated user and token

    // Fetch bookmarked blogs created by the user, only when user is authenticated
    useEffect(() => {
        if (user && user._id) {
            axios.get(`${API}/users/${user._id}/bookmarks`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => setBookmarkedBlogs(res.data)) // Set the fetched bookmarked blogs
                .catch(() => console.log('Failed to fetch your bookmarked blogs'));
        }
    }, [user._id, token]); // Only trigger this effect when user._id or token changes

    const handleUnbookmark = (blogId) => {
        if (window.confirm('Are you sure you want to remove this blog from bookmarks?')) {
            axios.delete(`${API}/users/${user._id}/remove/${blogId}`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            })
                .then(() => {
                    setBookmarkedBlogs(bookmarkedBlogs.filter(blog => blog._id !== blogId)); // Remove unbookmarked blog from state
                    toast.success('Blog removed from bookmarks successfully!')
                })
                .catch((err) => {
                    console.error(err); // Log error if unbookmarking fails
                    alert('Failed to remove the blog from bookmarks');
                });
        }
    }

    return (
        <>
            <ToastContainer position='bottom-right' theme='colored'/>
            <div>
                {bookmarkedBlogs.length > 0 ? (
                    bookmarkedBlogs.map((blog, i) => {

                        const firstImage = blog.content.find(item => item.files_url)?.files_url;
                        const previewText = blog.content.find(item => item.content_text)?.content_text || '';

                        return (
                            <div key={i} className="border-bottom py-4">

                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <Link to={`/blog/${blog._id}`} className="text-decoration-none text-dark d-flex">
                                            <div className="col-md-8 px-2">
                                                <h5 className="fw-bold">{blog.title}</h5>
                                                <p className="text-muted">{previewText}</p>
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
                                            <button className='btn' title='Remove from bookmarks' onClick={() => handleUnbookmark(blog._id)}>
                                                <GoBookmarkSlashFill size={25} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })

                ) : (
                    <p className="text-center m-5 text-muted">You have not bookmarked any blogs yet.</p>
                )}

            </div>
        </>
    );
};

export default BookmarkedBlogs;
