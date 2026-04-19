import React, { useState, useEffect } from "react"
import { FaBookReader, FaRegBookmark } from "react-icons/fa"
import { PiHandsClappingBold } from "react-icons/pi"
import { Link } from "react-router-dom"
import axios from "axios"
import ProfileIcon from "./ProfileIcon"
import { isAuthenticated } from "../auth"
import { formatNumber } from "../utils/FormatNumber"
import { toast, ToastContainer } from "react-toastify"

const DISPLAY_SIZE = 10
const API = process.env.REACT_APP_API_URL
const IMG_URL = process.env.REACT_APP_API_IMG_URL

const Card = ({ activeTopic }) => {
  const [allBlogs, setAllBlogs] = useState([])
  const [visibleBlogs, setVisibleBlogs] = useState([])
  const { user, token } = isAuthenticated()
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState({})

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        let res

        if (activeTopic) {
          res = await axios.get(`${API}/blogs/topic/${activeTopic}`)
        } else {
          res = await axios.get(`${API}/bloglist`)
        }

        const blogs = activeTopic
          ? res.data
          : [...res.data].sort(() => Math.random() - 0.5)

        setAllBlogs(blogs)
        setVisibleBlogs(blogs.slice(0, DISPLAY_SIZE))

        const bookmarkStatus = {}
        blogs.forEach((blog) => {
          bookmarkStatus[blog._id] = !!localStorage.getItem(
            `bookmarked_${blog._id}`,
          )
        })

        setBookmarkedBlogs(bookmarkStatus)
      } catch (err) {
        console.log(err)
        setAllBlogs([])
        setVisibleBlogs([])
        setBookmarkedBlogs({})
      }
    }

    fetchBlogs()
  }, [activeTopic])

  const handleViewMore = () => {
    const alreadyShownIds = new Set(visibleBlogs.map((blog) => blog._id))
    const remaining = allBlogs.filter((blog) => !alreadyShownIds.has(blog._id))
    const nextBatch = remaining.slice(0, DISPLAY_SIZE)

    setVisibleBlogs((prev) => [...prev, ...nextBatch])
  }

  const handleBookmark = async (blogId) => {
    const userId = user._id

    if (bookmarkedBlogs[blogId]) {
      toast.error("You have already bookmarked this blog!")
      return
    }

    try {
      await axios.put(
        `${API}/users/${userId}/bookmark/${blogId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      toast.success("Bookmarked!")

      setBookmarkedBlogs((prev) => ({
        ...prev,
        [blogId]: true,
      }))

      localStorage.setItem(`bookmarked_${blogId}`, "true")
    } catch (err) {
      console.error(err)
      toast.error("Failed to bookmark")
    }
  }

  return (
    <>
      <ToastContainer position="bottom-right" theme="colored" />

      <div className="container-fluid container-md">
        {visibleBlogs && visibleBlogs.length > 0 ? (
          visibleBlogs.map((blog, i) => {
            const previewText = blog.content
              ? blog.content.replace(/<[^>]*>?/gm, "").slice(0, 100)
              : ""

            const firstImage = blog.content
              ? blog.content.match(/<img[^>]+src=["']([^"'>]+)["']/)
              : null

            const imageSrc = firstImage ? firstImage[1] : null

            const baseUrl = IMG_URL?.replace(/\/$/, "")

            return (
              <div key={i} className="border-bottom py-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-1 mx-3">
                  <ProfileIcon
                    name={blog.author.name}
                    style={{
                      fontSize: "12px",
                      width: "1.3rem",
                      height: "1.3rem",
                    }}
                  />
                  <span className="ms-2">
                    In <b>{blog.topic.topic_name}</b> by
                  </span>
                  <b className="ms-2 text-capitalize">{blog.author.name}</b>
                </div>

                {/* Blog Body */}
                <div className="row g-3">
                  <div className="col-md-12">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-decoration-none text-dark d-flex"
                    >
                      <div className="d-flex flex-md-row flex-column">
                        <div className="col-md-9 p-3">
                          <h5 className="fw-bold mb-2">{blog.title}</h5>
                          <p className="text-muted mb-0 text-wrap text-break">
                            {previewText.length > 100
                              ? previewText + "..."
                              : previewText}
                          </p>
                        </div>

                        <div className="col-md-3 d-flex align-items-center">
                          {imageSrc && (
                            <img
                              src={
                                imageSrc.startsWith("http")
                                  ? imageSrc
                                  : `${baseUrl}/${imageSrc.replace(/^\/+/, "")}`
                              }
                              alt="Blog Preview"
                              className="img-fluid rounded w-100"
                              style={{
                                maxHeight: "120px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="col-md-8 ps-3 d-flex justify-content-between text-muted small">
                      <div className="d-flex justify-content-between gap-4 text-center align cursor-pointer">
                        <span>
                          {new Date(blog.date).toLocaleDateString("en-GB", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>

                        <span title={`${blog.views} Views`}>
                          <FaBookReader size={15} /> {formatNumber(blog.views)}
                        </span>

                        <span title={`${blog.claps} Claps`}>
                          <PiHandsClappingBold size={18} />{" "}
                          {formatNumber(blog.claps)}
                        </span>
                      </div>

                      <button
                        className="btn bookmark-btn"
                        onClick={() => handleBookmark(blog._id)}
                        title="Bookmark"
                      >
                        <FaRegBookmark size={18} />
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

        {visibleBlogs.length < allBlogs.length && (
          <div className="text-center mt-4">
            <button className="btn more-btn px-4 my-3" onClick={handleViewMore}>
              Read More
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Card
