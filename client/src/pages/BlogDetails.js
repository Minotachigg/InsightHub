import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { FaBookReader, FaRegBookmark } from "react-icons/fa"
import { PiHandsClappingBold } from "react-icons/pi"
import { formatNumber } from "../utils/FormatNumber"
import { toast, ToastContainer } from "react-toastify"
import ProfileIcon from "../components/ProfileIcon"
import { isAuthenticated } from "../auth"

const BlogDisplay = () => {
  const API = process.env.REACT_APP_API_URL
  // for routing like /blog/:blogId
  const { blogId } = useParams()
  const [blog, setBlog] = useState(null)
  const [hasClapped, setHasClapped] = useState(false)
  const { user, token } = isAuthenticated()
  const [hasBookmarked, setHasBookmarked] = useState(false)

  const IMG_URL = process.env.REACT_APP_API_IMG_URL
  const cleanBase = IMG_URL?.replace(/\/$/, "")

  const fixHTML = (html) => {
    if (!html) return html

    return html.replaceAll(
      'src="/public/uploads/',
      `src="${cleanBase}/public/uploads/`,
    )
  }

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

    // Check if the user has already bookmarked this blog
    const bookmarked = localStorage.getItem(`bookmarked_${blogId}`)
    setHasBookmarked(!!bookmarked)
  }, [blogId])

  const handleClap = async (blogId) => {
    if (hasClapped) {
      toast.error("You have already clapped for this blog!")
      return
    }
    try {
      await axios.put(`${API}/likeblog/${blogId}`)
      setHasClapped(true)
      localStorage.setItem(`clapped_${blogId}`, "true")
      // Update the claps count in the state
      setBlog((prev) => ({ ...prev, claps: prev.claps + 1 }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleBookmark = async (blogId) => {
    const userId = user._id

    try {
      if (!hasBookmarked) {
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
        setHasBookmarked(true)
        localStorage.setItem(`bookmarked_${blogId}`, "true")
      } else {
        toast.error("You have already bookmarked this blog!")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to bookmark")
    }
  }

  if (!blog) return <div>Loading...</div>

  return (
    <>
      <ToastContainer position="bottom-right" theme="colored" />
      <div
        className="container mt-5"
        style={{ maxWidth: "800px", minHeight: "100vh" }}
      >
        <h2 className="mb-3">{blog.title}</h2>
        <div className="text-muted d-flex align-items-center gap-2 mb-3">
          <ProfileIcon
            name={blog.author.name}
            style={{ fontSize: "15px", width: "1.5rem", height: "1.5rem" }}
          />
          {blog.author.name}
          &nbsp; - &nbsp;
          {new Date(blog.date).toLocaleDateString()}
        </div>
        <p className="text-muted border-top border-bottom d-flex align-items-center justify-content-between p-2">
          <div>
            &nbsp;&nbsp;
            <span title={`${blog.views} Views`}>
              {" "}
              <FaBookReader size={15} /> {formatNumber(blog.views)}{" "}
            </span>
            &nbsp;&nbsp; - &nbsp;&nbsp;
            <button
              className="btn p-0"
              title={`${blog.claps} Claps`}
              onClick={() => handleClap(blog._id)}
            >
              <PiHandsClappingBold size={18} /> {formatNumber(blog.claps)}
            </button>
          </div>
          <button
            className="btn bookmark-btn"
            onClick={() => handleBookmark(blog._id)}
            title="Bookmark"
          >
            <FaRegBookmark size={18} />
          </button>
        </p>

        <div
          className="mt-4 blog-content"
          dangerouslySetInnerHTML={{
            __html: fixHTML(blog.content),
          }}
        />
      </div>
    </>
  )
}

export default BlogDisplay
