import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import TopicSlider from '../components/TopicSlider'

const ExploreTopics = () => {
    const API = process.env.REACT_APP_API_URL;
    const [topics, setTopics] = useState([])
    const [sliderTopics, setSliderTopics] = useState([])
    const [suggestedTopic, setSuggestedTopic] = useState([])
    const [activeTopic, setActiveTopic] = useState(null)
    const navigate = useNavigate()

    const handleTopicSelect = (topicId) => {
        setActiveTopic(topicId)
        navigate(`/tag/blogs?topicId=${topicId}`)
    }

    // Recommeded topics and random topics
    useEffect(() => {
        axios.get(`${API}/topiclist`)
            .then(res => {
                const topicNames = ['Technology', 'Lifestyle', 'Business']
                const filterTopic = res.data.filter(topic => topicNames.includes(topic.topic_name))

                const randomTopics = res.data
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 15)

                // Set the topics and sliderTopics
                setTopics(res.data)
                setSliderTopics(randomTopics)
                setSuggestedTopic(filterTopic)

                // Debugging - Check if sliderTopics is populated
                console.log('sliderTopics:', randomTopics) // Ensure this has data
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <>
            <div className="container mt-3">
                <TopicSlider
                    topics={sliderTopics}
                    onTopicSelect={handleTopicSelect}
                    activeTopic={activeTopic}
                    itemClassName={'text-dark explore-topic-link'}
                />

                {/* explore topics */}
                <div className="text-center mt-5 mb-5">
                    <h2 className="s-1 mb-2">Explore Topics</h2>
                    <p style={{ fontSize: '.85rem' }}>Recommended: &nbsp;&nbsp;
                        {suggestedTopic.map((rt, i) => (
                            <Link key={i} to={`/tag/blogs?topicId=${rt._id}`} className="text-dark ts-link me-2" >
                                {rt.topic_name}
                            </Link>
                        ))}

                    </p>
                </div>
                <div className="row py-4 w-75 m-auto border-top">
                    {topics.map((topic, i) => (
                        <div key={i} className="col-12 col-sm-6 col-md-4 mb-3">
                            <Link to={`/tag/blogs?topicId=${topic._id}`} className="text-dark text-decoration-none">
                                <div className="py-2 h-100 d-flex ts-link justify-content-center align-items-center">
                                    <span>{topic.topic_name}</span>
                                </div>
                            </Link>

                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ExploreTopics
