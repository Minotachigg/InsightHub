import React, { useState, useEffect } from 'react'
import { FaTrash } from "react-icons/fa6"
import axios from 'axios'
import AdminSidebar from './AdminSidebar'
import { Link } from 'react-router-dom'

const Bloglist = () => {
  const API = process.env.REACT_APP_API_URL;
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API}/bloglist`)
        setBlogs(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const confirmDelete = (id) => {
    setDeleteId(id)
    setShowConfirm(true)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/blogdetails/${deleteId}`)
      setBlogs(blogs.filter(blog => blog._id !== deleteId))
      setShowConfirm(false)
    } catch (err) {
      console.error(err)
      alert("Error deleting blog")
    }
  }

  return (
    <>
      <div className="wrapper d-flex">
        <AdminSidebar />
        <main className="content p-4 w-75">
          <h3 className="mb-4 text-dark ms-lg-5">All Blogs</h3>

          {loading ? (
            <p className="text-center text-muted">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p className="text-center text-muted">No blogs found.</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="d-none d-md-block ms-lg-5">
                <table className="table table-hover table-bordered align-middle">
                  <thead className="table-dark text-center">
                    <tr>
                      <th style={{ width: '50%' }}>Title</th>
                      <th style={{ width: '15%' }}>Topic</th>
                      <th style={{ width: '15%' }}>Author</th>
                      <th style={{ width: '15%' }}>Created At</th>
                      <th style={{ width: '5%' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map(blog => (
                      <tr key={blog._id} className="align-middle">
                        <td>
                          <Link to={`/blog/${blog._id}`} className="text-decoration-none text-dark fw-semibold">
                            {blog.title}
                          </Link>
                        </td>
                        <td className="text-center">{blog.topic.topic_name}</td>
                        <td className="text-center">{blog.author.name}</td>
                        <td className="text-center text-muted" title={new Date(blog.createdAt).toLocaleString()}>
                          {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="text-center">
                          <button
                            aria-label={`Delete blog titled ${blog.title}`}
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => confirmDelete(blog._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="d-md-none">
                {blogs.map(blog => (
                  <div key={blog._id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/blog/${blog._id}`} className="text-decoration-none text-primary">
                          {blog.title}
                        </Link>
                      </h5>
                      <p className="card-text mb-1"><strong>Topic:</strong> {blog.topic.topic_name}</p>
                      <p className="card-text mb-1"><strong>Author:</strong> {blog.author.name}</p>
                      <p className="card-text mb-2 text-muted" title={new Date(blog.createdAt).toLocaleString()}>
                        {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <button
                        aria-label={`Delete blog titled ${blog.title}`}
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmDelete(blog._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Confirmation Modal */}
          {showConfirm && (
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="confirmDeleteTitle" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 id="confirmDeleteTitle" className="modal-title">Confirm Delete</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowConfirm(false)}></button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete this blog? This action cannot be undone.
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default Bloglist
