import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import { isAuthenticated } from '../auth'
import { toast, ToastContainer } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { FaImage } from "react-icons/fa"
import { PiHighlighterDuotone } from "react-icons/pi"

const EditBlog = () => {
    const API = process.env.REACT_APP_API_URL;
    const { blogId } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('')
    const [topicList, setTopicList] = useState([])
    const [fileQueue, setFileQueue] = useState([])
    const fileInputRef = useRef()
    const { user } = isAuthenticated()
    const [initialContent, setInitialContent] = useState('')

    // Editor instance
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder: 'Tell your story...',
                emptyEditorClass: 'is-editor-empty',
                showOnlyWhenEditable: true,
            }),
            Underline,
            Highlight.configure({ multicolor: true })
        ],
        content: '',
    })

    // Fetch topic list
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axios.get(`${API}/topiclist`)
                setTopicList(res.data)
            } catch (err) {
                console.error("Error fetching topics:", err)
            }
        }
        fetchTopics()
    }, [])

    // Fetch blog data (remove editor from dependency array!)
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${API}/blogdetails/${blogId}`)
                setTitle(res.data.title)
                setTopic(res.data.topic?._id || '')
                setInitialContent(res.data.content)
            } catch (err) {
                toast.error('Failed to load blog for editing')
            }
        }
        fetchBlog()
    }, [blogId])

    // Set blog content in the editor
    useEffect(() => {
        if (editor && initialContent) {
            editor.commands.setContent(initialContent)
        }
    }, [editor, initialContent])

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await axios.post(`${API}/uploadImage`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            const imageUrl = response.data.url
            editor?.chain().focus().setImage({ src: imageUrl }).run()
            setFileQueue(prev => [...prev, file])
        } catch (error) {
            toast.error('Image upload failed')
        }

        e.target.value = null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const confirmed = window.confirm("Are you sure you want to update this blog?")
        if (!confirmed) return


        if (!title.trim()) return toast.error('Title is required')
        if (!topic.trim()) return toast.error('Please select a topic')
        if (!editor || editor.getHTML() === '<p></p>') {
            return toast.error('Content cannot be empty')
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('topic', topic)
        formData.append('author', user?._id || '')
        formData.append('content_html', editor.getHTML())
        fileQueue.forEach(file => formData.append('files', file))

        try {
            await axios.put(`${API}/updateblog/${blogId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            toast.success('Blog updated successfully!')
            setTimeout(() => navigate(`/blog/${blogId}`), 1000)
        } catch (err) {
            toast.error('Error updating blog')
        }
    }

    return (
        <>
            <ToastContainer position='bottom-right' theme="colored" />
            <Header isWritePage={true} user={user} />
            <div className="container mt-4" style={{ maxWidth: '1000px' }}>
                <form onSubmit={handleSubmit}>
                    {/* Topic Dropdown */}
                    <div className="form-group mb-4 w-25 position-relative">
                        <label htmlFor="topic" className="text-muted position-absolute fst-italic" style={{ left: '-3rem', top: '50%', transform: 'translateY(-50%)' }}>
                            Topic
                        </label>
                        <select
                            id="topic"
                            className="form-control ms-5"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a topic</option>
                            {topicList.map((item) => (
                                <option key={item._id} value={item._id}>{item.topic_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title Input */}
                    <div className="form-group mb-4 position-relative">
                        <label htmlFor="title" className="text-muted position-absolute fst-italic" style={{ left: '-50px', top: '50%', transform: 'translateY(-50%)' }}>
                            Title
                        </label>
                        <textarea
                            id="title"
                            className="form-control title-box form-control-lg px-5 border-0 border-bottom"
                            placeholder="Title Here..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={100}
                            rows={2}
                            style={{ resize: 'none', overflow: 'hidden' }}
                        ></textarea>
                    </div>

                    {/* Editor */}
                    <div className="form-group mb-4 position-relative">
                        <label className="text-muted position-absolute fst-italic" style={{ left: '-6rem', top: '0%', transform: 'translateY(-50%)' }}>
                            Content Start
                        </label>
                        <div className="content-box px-5 border-0" style={{ minHeight: '2rem', padding: '10px' }}>
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="d-flex gap-2 mb-3 sticky-top py-2" style={{ zIndex: 10 }}>
                        <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => fileInputRef.current.click()}>
                            <FaImage size={25} />
                        </button>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 fs-5" onClick={() => editor?.chain().focus().toggleBold().run()}> <b>B</b> </button>
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 fs-5" onClick={() => editor?.chain().focus().toggleItalic().run()}> <em>I</em> </button>
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 fs-5" onClick={() => editor?.chain().focus().toggleUnderline().run()}> <u>U</u> </button>
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 bg-warning" onClick={() => editor?.chain().focus().toggleHighlight({ color: '#FFFF00' }).run()}>
                            <PiHighlighterDuotone size={25} />
                        </button>
                    </div>

                    <div className="my-3 py-3 text-center border-top">
                        <button className="btn btn-primary" type="submit">Update Blog</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditBlog
