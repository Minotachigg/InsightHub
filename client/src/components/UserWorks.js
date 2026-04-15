import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { toast, ToastContainer } from 'react-toastify'

const API = process.env.REACT_APP_API_URL;
const IMG_URL = process.env.REACT_APP_API_IMG_URL;

const UserWorks = () => {
    const [userBlogs, setUserBlogs] = useState([])
    const { user, token } = isAuthenticated()

    useEffect(() => {
        if (user && user._id) {
            axios.get(`${API}/blogs/user/${user._id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => setUserBlogs(res.data))
                .catch((err) => {
                    if (err.response?.status === 404) setUserBlogs([])
                    else console.error('Failed to fetch your blogs', err)
                })
        }
    }, [user._id, token])

    const handleDelete = (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            axios.delete(`${API}/deleteblog/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(() => {
                    setUserBlogs(userBlogs.filter(blog => blog._id !== blogId))
                    toast.success('Blog deleted successfully!')
                })
                .catch((err) => {
                    console.error(err)
                    alert('Failed to delete the blog')
                })
        }
    }

    return (
        <>
            <ToastContainer position='bottom-right' theme='colored' />
            <div>
                {userBlogs.length > 0 ? (
                    userBlogs.map((blog, i) => {
                        const previewText = blog.content
                            ? blog.content.replace(/<[^>]*>?/gm, '').slice(0, 100)
                            : ''

                        const firstImageMatch = blog.content
                            ? blog.content.match(/<img[^>]+src=["']([^"'>]+)["']/)
                            : null

                        const firstImage = firstImageMatch ? firstImageMatch[1] : null

                        return (
                            <div key={i} className="border-bottom py-4">
                                <div className="row g-0">
                                    <Link to={`/blog/${blog._id}`} className="text-decoration-none text-dark">
                                        <div className="d-flex flex-md-row flex-column">
                                            <div className="col-md-8 p-3">
                                                <h5 className="fw-bold mb-2">{blog.title}</h5>
                                                <p className="text-muted mb-0 text-wrap text-break">
                                                    {previewText.length > 100 ? previewText + '...' : previewText}
                                                </p>
                                            </div>
                                            <div className="col-md-4 p-3 d-flex align-items-center">
                                                {firstImage && (
                                                    <img
                                                        src={firstImage.startsWith('http') ? firstImage : `${IMG_URL}/${firstImage}`}
                                                        alt="Blog Preview"
                                                        className="img-fluid rounded w-100"
                                                        style={{ maxHeight: '120px', objectFit: 'cover' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="col-md-8 d-flex justify-content-between align-items-center px-3 mt-2 text-muted small">
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
                                                id={`dropdown-${i}`}
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <PiDotsThreeOutlineFill size={25} style={{ color: '#000000' }} title='Options' />
                                            </span>

                                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${i}`}>
                                                <li><Link className="dropdown-item text-success" to={`/edit/${blog._id}`}>Edit</Link></li>
                                                <li><button className="dropdown-item text-danger" onClick={() => handleDelete(blog._id)}>Delete</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-center m-5 text-muted">You haven't written any blogs yet.</p>
                )}
            </div>
        </>
    )
}

export default UserWorks
