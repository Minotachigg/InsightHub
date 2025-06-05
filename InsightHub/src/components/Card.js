import React, { useState, useEffect } from 'react'
import { MdBookmarkAdd } from "react-icons/md"
import { FaBookReader } from "react-icons/fa"
import { PiHandsClappingBold } from "react-icons/pi"
import { Link } from 'react-router-dom'
import { API, IMG_URL } from '../config'
import axios from 'axios'
import ProfileIcon from './ProfileIcon'
import { isAuthenticated } from '../auth'
import { formatNumber } from '../utils/FormatNumber'
import { toast, ToastContainer } from 'react-toastify'

const DISPLAY_SIZE = 10

const Card = ({ activeTopic }) => {
  const [allBlogs, setAllBlogs] = useState([])
  const [visibleBlogs, setVisibleBlogs] = useState([])
  const { user, token } = isAuthenticated()
  // Fetch all blogs on load
  useEffect(() => {
    axios.get(`${API}/bloglist`)
      .then(res => {
        setAllBlogs(res.data)
        const shuffled = [...res.data].sort(() => Math.random() - 0.5)
        const initial = shuffled.slice(0, DISPLAY_SIZE)
        setVisibleBlogs(initial)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  // Filter blogs based on the active topic
  useEffect(() => {
    const filtered = activeTopic ? allBlogs.filter(blog => blog.topic._id === activeTopic) : [...allBlogs].sort(() => Math.random() - 0.5) // For You = random

    setVisibleBlogs(filtered.slice(0, DISPLAY_SIZE))
  }, [activeTopic, allBlogs]) // Re-run when activeTopic or allBlogs change

  // Handle View More
  const handleViewMore = () => {
    const alreadyShownIds = new Set(visibleBlogs.map(blog => blog._id))
    const source = activeTopic
      ? allBlogs.filter(blog => blog.topic._id === activeTopic)
      : allBlogs

    const remaining = source.filter(blog => !alreadyShownIds.has(blog._id))
    const shuffled = [...remaining].sort(() => Math.random() - 0.5)
    const nextBatch = shuffled.slice(0, DISPLAY_SIZE)

    setVisibleBlogs(prev => [...prev, ...nextBatch])
  }

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

  return (
    <>
      <ToastContainer position='bottom-right' theme="colored" />
      <div className="container-fluid container-md">

        {visibleBlogs && visibleBlogs.length > 0 ? (
          visibleBlogs.map((blog, i) => {
            const previewText = blog.content
              ? blog.content.replace(/<[^>]*>?/gm, '').slice(0, 100)
              : ''

            const firstImageMatch = blog.content
              ? blog.content.match(/<img[^>]+src=["']([^"'>]+)["']/)
              : null

            const firstImage = firstImageMatch ? firstImageMatch[1] : null

            return (
              <div key={i} className="border-bottom py-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-3">
                  <Link to={`/profile/${blog.author._id}`} className='d-flex align-items-center text-decoration-none text-dark'>
                    <ProfileIcon name={blog.author.name} style={{ fontSize: '15px', width: '1.5rem', height: '1.5rem' }} />
                    <span className="ms-2 fw-semibold text-capitalize">
                      {blog.author.name} 
                    </span>
                  </Link>
                  <span> &nbsp; - &nbsp;  {blog.topic.topic_name}</span>
                </div>

                {/* Blog Body */}
                <div className="row g-3">
                  <div className="col-md-12">
                    <Link to={`/blog/${blog._id}`} className="text-decoration-none text-dark d-flex">
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
                              style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="col-md-8 px-3 d-flex justify-content-between text-muted small">
                      <div className='d-flex justify-content-between gap-4 text-center align cursor-pointer'>
                        <span>{new Date(blog.date).toLocaleDateString('en-GB', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        </span>
                        <span title={`${blog.views} Views`}> <FaBookReader size={15} /> {formatNumber(blog.views)} </span>
                        <span title={`${blog.claps} Claps`}> <PiHandsClappingBold size={18} /> {formatNumber(blog.claps)} </span>

                      </div>
                      <button className="btn" onClick={() => handleBookmark(blog._id)} title="Bookmark">
                        <MdBookmarkAdd size={25} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-center text-muted">No blogs found.</p>
        )}

        {visibleBlogs.length < (activeTopic
          ? allBlogs.filter(blog => blog.topic._id === activeTopic).length
          : allBlogs.length) && (
            <div className="text-center mt-4">
              <button className="btn px-4 my-3" onClick={handleViewMore} style={{ border: '1px solid black', color: '#333', borderRadius: '30px' }}>
                View More
              </button>
            </div>
          )}
      </div>
    </>
  )
}

export default Card
