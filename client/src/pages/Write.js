import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import { isAuthenticated } from '../auth'
import { toast, ToastContainer } from 'react-toastify'
import { FaImage } from "react-icons/fa"
import { PiHighlighterDuotone } from "react-icons/pi"
// Import Tiptap components and extensions
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'

const Write = () => {
    const API = process.env.REACT_APP_API_URL;
    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('')
    const [topicList, setTopicList] = useState([])
    const fileInputRef = useRef()
    const [fileQueue, setFileQueue] = useState([])
    const { user } = isAuthenticated()
    const handleSubmitRef = useRef(null)

    // Initialize Tiptap editor with necessary extensions
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder: 'Tell your story...',
                emptyEditorClass: 'is-editor-empty',
                showOnlyWhenEditable: true,
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Underline,
        ],
        content: '',
    })

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get(`${API}/topiclist`)
                setTopicList(response.data)
            } catch (err) {
                console.error("Error fetching topics:", err)
            }
        }
        fetchTopics()
    }, [])


    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault()

        if (!title.trim()) {
            toast.error("Title cannot be empty.")
            return
        }
        if (!topic.trim()) {
            toast.error("Please select a topic.")
            return
        }
        if (!editor) {
            toast.error("Editor not ready.")
            return
        }

        // Get the HTML content from the editor
        const contentHTML = editor.getHTML()
        if (!contentHTML || contentHTML === '<p></p>') {
            toast.error("Content cannot be empty.")
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('topic', topic)
        formData.append('author', user?._id || '')
        formData.append('content_html', contentHTML)  //  Store HTML directly

        for (let file of fileQueue) {
            formData.append('files', file)
        }

        try {
            await axios.post(`${API}/createblog`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            toast.success('Blog posted successfully!')
            editor.commands.clearContent()
            setTitle('')
            setTopic('')
            setFileQueue([])
        } catch (err) {
            console.error(err)
            toast.error('Error posting blog')
        }


    }

    useEffect(() => {
        handleSubmitRef.current = handleSubmit
    }, [title, topic, fileQueue, editor])

    useEffect(() => {
        const handleCustomSubmit = (e) => {
            if (handleSubmitRef.current) {
                handleSubmitRef.current(e)
            }
        }
        window.addEventListener("submitBlog", handleCustomSubmit)
        return () => {
            window.removeEventListener("submitBlog", handleCustomSubmit)
        }
    }, [])

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Upload file to backend
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await axios.post(`${API}/uploadImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const imageUrl = response.data.url

            // Insert image URL into the editor
            if (editor) {
                editor.chain().focus().setImage({ src: imageUrl }).run()
            }

            // Optionally add to fileQueue if you want to track uploaded files
            setFileQueue(prev => [...prev, file])

        } catch (error) {
            console.error('Image upload failed:', error)
            toast.error('Failed to upload image')
        }

        // Reset file input so same file can be selected again if needed
        e.target.value = null
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
                                <option key={item._id} value={item._id}>
                                    {item.topic_name}
                                </option>
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
                        <label htmlFor="content" className="text-muted position-absolute fst-italic" style={{ left: '-6rem', top: '0%', transform: 'translateY(-50%)' }}>
                            Content Start
                        </label>
                        <div
                            className="content-box px-5 border-0"
                            style={{
                                minHeight: '2rem',
                                padding: '10px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                borderRadius: '8px',
                                position: 'relative',
                                color: 'black',
                            }}>
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="d-flex gap-2 mb-3 sticky-top py-2" style={{ zIndex: 10 }}>
                        <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => fileInputRef.current.click()}>
                            <FaImage size={25} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 fs-5" onClick={() => editor?.chain().focus().toggleBold().run()}> <b>B</b> </button>
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 fs-5" onClick={() => editor?.chain().focus().toggleItalic().run()}> <em>I</em> </button>
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 fs-5" onClick={() => editor?.chain().focus().toggleUnderline().run()}> <u>U</u> </button>
                        <button type="button" className="btn btn-sm btn-outline-dark px-3 bg-warning" onClick={() => editor?.chain().focus().toggleHighlight({ color: '#FFFF00' }).run()}>
                            <PiHighlighterDuotone size={25} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Write
