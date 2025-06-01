import React, { useState, useEffect } from 'react'
import { FaTrash } from "react-icons/fa6"
import axios from 'axios'
import { API } from '../config'
import AdminSidebar from './AdminSidebar'
import { Link } from 'react-router-dom'

const Bloglist = () => {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        axios.get(`${API}/bloglist`)
            .then(res => {
                setBlogs(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return
        try {
            await axios.delete(`${API}/blogdetails/${id}`)
            setBlogs(blogs.filter(blog => blog._id !== id))
        } catch (err) {
            console.error(err)
            alert("Error deleting blog")
        }
    }

    return (
        <>
            <div className="wrapper d-flex align-items-stretch w-100">
                <AdminSidebar />
                <div className="container mt-4">
                    <h3 className="mb-4">All Blogs</h3>
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th style={{ width: '60%' }}>Title</th>
                                        <th>Topic</th>
                                        <th>Author</th>
                                        <th>Created At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.length > 0 ? blogs.map((blog, i) => (
                                        <tr key={i}>
                                            <td> <Link to={`/blog/${blog._id}`} className='blog_title'> {blog.title} </Link></td>
                                            <td className='text-center'>{blog.topic.topic_name}</td>
                                            <td className='text-center'>{blog.author.name}</td>
                                            <td className='text-center'>{new Date(blog.createdAt).toLocaleDateString('en-GB', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}</td>
                                            <td className='text-center'>
                                                <button className="btn btn-danger" onClick={() => handleDelete(blog._id)} style={{ fontSize: '15px' }}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No blogs found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Bloglist
