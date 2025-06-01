import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API, IMG_URL } from '../config'
import { isAuthenticated } from '../auth'
import { GoBookmarkSlashFill } from "react-icons/go"
import { toast, ToastContainer } from 'react-toastify'

const BookmarkedBlogs = () => {
    const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]) || [] // State to hold user's bookmarked blogs
    const { user, token } = isAuthenticated() // Get authenticated user and token

    // Fetch bookmarked blogs created by the user, only when user is authenticated
    useEffect(() => {
        if (user && user._id) {
            axios.get(`${API}/users/${user._id}/bookmarks`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => setBookmarkedBlogs(res.data)) // Set the fetched bookmarked blogs
                .catch(() => console.log('Failed to fetch your bookmarked blogs'))
        }
    }, [user._id, token]) // Only trigger this effect when user._id or token changes

    const handleUnbookmark = (blogId) => {
        if (window.confirm('Are you sure you want to remove this blog from bookmarks?')) {
            axios.delete(`${API}/users/${user._id}/remove/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
                .then(() => {
                    setBookmarkedBlogs(bookmarkedBlogs.filter(blog => blog._id !== blogId)) // Remove unbookmarked blog from state
                    toast.success('Blog removed from bookmarks successfully!')
                })
                .catch((err) => {
                    console.error(err) // Log error if unbookmarking fails
                    alert('Failed to remove the blog from bookmarks')
                })
        }
    }

    return (
        <>
            <ToastContainer position="bottom-right" theme="colored" />
            <div>
                {bookmarkedBlogs.length > 0 ? (
                    bookmarkedBlogs.map((blog, i) => {
                        const previewText = blog.content
                            ? blog.content.replace(/<[^>]*>?/gm, '').slice(0, 100)
                            : ''

                        const firstImageMatch = blog.content
                            ? blog.content.match(/<img[^>]+src=["']([^"'>]+)["']/)
                            : null

                        const firstImage = firstImageMatch ? firstImageMatch[1] : null

                        return (
                            <div key={i} className="border-bottom py-4">
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-8">
                                        <Link
                                            to={`/blog/${blog._id}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <h5 className="fw-bold mb-2">{blog.title}</h5>
                                            <p className="text-muted mb-0 text-wrap text-break">
                                                {previewText.length > 100 ? previewText + '...' : previewText}
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="col-md-4">
                                        {firstImage && (
                                            <img
                                                src={
                                                    firstImage.startsWith('http')
                                                        ? firstImage
                                                        : `${IMG_URL}/${firstImage}`
                                                }
                                                alt="Blog Preview"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-8 d-flex justify-content-between align-items-center px-1 pt-2 text-muted small">
                                    <span>
                                        {new Date(blog.date).toLocaleDateString('en-GB', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <button
                                        className="btn btn-sm"
                                        title="Remove from bookmarks"
                                        onClick={() => handleUnbookmark(blog._id)}
                                    >
                                        <GoBookmarkSlashFill size={22} />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-center m-5 text-muted">
                        You have not bookmarked any blogs yet.
                    </p>
                )}
            </div>
        </>
    )

}

export default BookmarkedBlogs
