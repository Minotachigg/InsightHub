import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import TopicSlider from '../components/TopicSlider'
import Card from '../components/Card'
import { API } from '../config'
import Header from '../components/Header'
import Footer from '../components/Footer'

const TopicBlogs = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [activeTopic, setActiveTopic] = useState(null)
    const [topics, setTopics] = useState([])
    const selectedTopic = topics.find(topic => topic._id === activeTopic)
    const [blogCount, setBlogCount] = useState(0)

    // Extract topicId from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const topicId = queryParams.get('topicId')
        if (topicId) {
            setActiveTopic(topicId)
        }
    }, [location])

    // Fetch all topics for the slider
    useEffect(() => {
        axios.get(`${API}/topiclist`)
            .then(res => setTopics(res.data))
            .catch(err => console.error('Error fetching topics:', err))
    }, [])

    useEffect(() => {
        if (activeTopic) {
            axios.get(`${API}/blogs/count/${activeTopic}`)
                .then(res => setBlogCount(res.data.count))
                .catch(err => {
                    console.error('Error fetching blog count:', err)
                    setBlogCount(0) 
                })
        }
    }, [activeTopic])
    

    const handleTopicSelect = (topicId) => {
        setActiveTopic(topicId)
        navigate(`/tag/blogs?topicId=${topicId}`)
    }

    if (!activeTopic) {
        return <div className="text-center mt-5">Invalid or missing topic. Please go back and try again.</div>
    }

    return (
        <>
            <Header />
            <div className="container mt-3">
                {/* Topic Slider */}
                <TopicSlider topics={topics} onTopicSelect={handleTopicSelect} activeTopic={activeTopic} itemClassName={'text-dark explore-topic-link'} />

                {/* Blog Cards */}
                <div className="text-center my-5">
                    <div className='mb-4'>
                    <h2>{selectedTopic?.topic_name || 'Loading topic...'}</h2>
                        <span className='text-muted'>Topic</span> &nbsp | &nbsp
                        <span className="text-muted">{blogCount} Stories</span>
                    </div>
                    <div className="row py-4 w-75 m-auto border-top">
                        <Card activeTopic={activeTopic} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default TopicBlogs
