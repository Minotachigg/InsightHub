import React from 'react'
import { FaBookReader, FaRegBookmark } from "react-icons/fa"
import { PiHandsClappingBold } from "react-icons/pi"
import { Link } from 'react-router-dom'
import ProfileIcon from './ProfileIcon'
import { formatNumber } from '../utils/FormatNumber'
import { toast, ToastContainer } from 'react-toastify'
import { isAuthenticated } from '../auth'
import axios from 'axios'

const API = process.env.REACT_APP_API_URL;
const IMG_URL = process.env.REACT_APP_API_IMG_URL;

const TagCard = ({ blog, activeTopic }) => {

    const { user, token } = isAuthenticated()
    
    const handleBookmark = async (blogId) => {
        const userId = user._id
        console.log("userId", userId)
        try {
            await axios.put(`${API}/users/${userId}/bookmark/${blogId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })

            toast.success("Bookmarked!")
        } catch (err) {
            console.error(err)
            toast.error("Failed to bookmark")
        }
    }

    // Check if blog is valid
    if (!blog) return null
    // Check if blog has content
    const previewText = blog.content
        ? blog.content.replace(/<[^>]*>?/gm, '').slice(0, 100)
        : ''
    // Extract the first image from the blog content
    const firstImageMatch = blog.content
        ? blog.content.match(/<img[^>]+src=["']([^"'>]+)["']/)
        : null
    // If no image found, set firstImage to null
    const firstImage = firstImageMatch ? firstImageMatch[1] : null

    return (
        <>
            <ToastContainer position="bottom-right" theme='colored' />
            <div className="card mb-4 shadow-none bg-transparent">
                {/* Image on top */}
                {firstImage && (
                    <Link to={`/blog/${blog._id}`} className='d-flex align-items-center text-decoration-none text-dark'>
                        <img
                            src={firstImage.startsWith('http') ? firstImage : `${IMG_URL}/${firstImage}`}
                            alt="Blog Preview"
                            className="card-img-top"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                    </Link>
                )}
                {/* Author Info */}
                <div className="d-flex mt-4 align-items-center justify-content-start mb-1 ms-2">
                    <Link to={`/profile/${blog.author._id}`} className='d-flex align-items-center text-decoration-none text-dark'>
                        <ProfileIcon name={blog.author.name} style={{ fontSize: '12px', width: '1.3rem', height: '1.3rem' }} />
                        <span className="ms-2"> In <b>{blog.topic.topic_name} </b> by</span>
                        <b className="ms-2 text-capitalize">{blog.author.name}</b>
                    </Link>
                </div>

                {/* Card Body */}
                <div className="card-body text-start">
                    {/* Title and Preview Text */}
                    <Link to={`/blog/${blog._id}`} className="text-decoration-none text-dark">
                        <h3 className="card-title fw-bold">{blog.title}</h3>
                        <p className="card-text text-muted ">
                            {previewText.length > 100 ? previewText + '...' : previewText}
                        </p>
                    </Link>

                    {/* Metadata and Actions */}
                    <div className="d-flex justify-content-between align-items-center small text-muted mt-3">
                        <div className="d-flex gap-3">
                            <span>{new Date(blog.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                            <span title={`${blog.views} Views`}><FaBookReader size={15} /> {formatNumber(blog.views)}</span>
                            <span title={`${blog.claps} Claps`}><PiHandsClappingBold size={18} /> {formatNumber(blog.claps)}</span>
                        </div>

                        <button className="btn bookmark-btn" onClick={() => handleBookmark(blog._id)} title="Bookmark">
                            <FaRegBookmark size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TagCard