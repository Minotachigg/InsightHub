import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../config'
import { useParams } from 'react-router-dom'
import { FaBookReader } from "react-icons/fa"
import { PiHandsClappingBold } from "react-icons/pi"
import { formatNumber } from '../utils/FormatNumber'
import { toast, ToastContainer } from 'react-toastify'
import ProfileIcon from '../components/ProfileIcon'

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
            return
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
            <ToastContainer position='bottom-right' theme='colored' />
            <div className="container mt-5" style={{ maxWidth: '800px', minHeight: '100vh' }}>
                <h2 className="mb-3">{blog.title}</h2>
                <div className='text-muted d-flex align-items-center gap-2 mb-3'>
                    <ProfileIcon name={blog.author.name} style={{ fontSize: '15px', width: '1.5rem', height: '1.5rem' }} />
                    {blog.author.name}
                    &nbsp -  &nbsp
                    {new Date(blog.date).toLocaleDateString()}
                </div>
                <p className="text-muted border-top border-bottom d-flex align-items-center p-2">
                    &nbsp&nbsp
                    <span title={`${blog.views} Views`}> <FaBookReader size={15} /> {formatNumber(blog.views)} </span>
                    &nbsp&nbsp - &nbsp&nbsp
                    <button className='btn p-0' title={`${blog.claps} Claps`} onClick={() => handleClap(blog._id)}>
                        <PiHandsClappingBold size={18} /> {formatNumber(blog.claps)}
                    </button>
                </p>

                <div
                    className="mt-4 blog-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

            </div>
        </>
    )
}

export default BlogDisplay
