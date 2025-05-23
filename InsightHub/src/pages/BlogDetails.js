import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API, IMG_URL } from '../config'
import { useParams } from 'react-router-dom'
import { FaBookReader } from "react-icons/fa";
import { PiHandsClappingBold } from "react-icons/pi";
import { formatNumber } from '../utils/FormatNumber'
import { toast } from 'react-toastify';

const BlogDisplay = () => {
    // for routing like /blog/:blogId
    const { blogId } = useParams()
    const [blog, setBlog] = useState(null)
    const [hasClapped, setHasClapped] = useState(false)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${API}/blogdetails/${blogId}`)
                setBlog(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchBlog()
    }, [blogId])

    useEffect(() => {
        // Check if the user has already clapped for this blog
        const clapped = localStorage.getItem(`clapped_${blogId}`)
        setHasClapped(!!clapped)
    }, [blogId])
    
    const handleClap = async (blogId) => {
        if (hasClapped) {
            toast.error('You have already clapped for this blog!')
        }
        try {
            await axios.put(`${API}/likeblog/${blogId}`)
            setHasClapped(true)
            localStorage.setItem(`clapped_${blogId}`, 'true')
            // Update the claps count in the state
            setBlog((prev) => ({ ...prev, claps: prev.claps + 1 }))
        } catch (err) {
            console.error(err)
        }
    }

    if (!blog) return <div>Loading...</div>

    return (
        <>
            <div className="container mt-5" style={{ maxWidth: '800px', minHeight: '100vh' }}>
                <h2 className="mb-3">{blog.title}</h2>
                <p className="text-muted">
                    By {blog.author.name} | {new Date(blog.date).toLocaleDateString()}
                    &nbsp;&nbsp; | &nbsp;
                    <span title={`${blog.views} Views`}> <FaBookReader size={15} /> {formatNumber(blog.views)} </span>
                    &nbsp;&nbsp; |
                    <button className='btn' title={`${blog.claps} Claps`} onClick={() => handleClap(blog._id)} disabled={hasClapped}>
                        <PiHandsClappingBold size={18} /> {formatNumber(blog.claps)}
                    </button>
                </p>
                <hr />

                <div className="mt-4">
                    {blog.content.map((block, index) => {
                        if (block.content_text) {
                            return (
                                <p key={index} style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    {block.content_text}
                                </p>
                            )
                        } else if (block.files_url) {
                            return (
                                <img
                                    key={index}
                                    src={`${IMG_URL}/${block.files_url}`}
                                    alt="blog media"
                                    style={{ maxWidth: '100%', borderRadius: '8px', margin: '20px 0' }}
                                />
                            )
                        } else {
                            return null
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export default BlogDisplay
