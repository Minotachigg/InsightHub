import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import SideSection from '../components/SideSection'
import TopicSlider from '../components/TopicSlider'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { API } from '../config'

const HomePage = () => {
  const [topics, setTopics] = useState([])
  const [activeTopic, setActiveTopic] = useState(null)

  useEffect(() => {
    axios.get(`${API}/topiclist`)
      .then(res => {
        const randomTopics = res.data
          .sort(() => Math.random() - 0.5)
          .slice(0, 15)
        setTopics(randomTopics)
      })
      .catch(err => {
        console.error("Error fetching topics:", err)
      })
  }, [])

  const handleTopicSelect = (topicId) => {
    setActiveTopic(topicId) 
  }

  return (
    <>
      <Header />
      <div className="container py-3">
        <div className="row gx-5">

          {/* Left section with TopicSlider + Card */}
          <div className="col-12 col-lg-8" style={{ paddingRight: '50px' }}>
            {/* Sticky Topic Slider */}
            <div className="position-sticky py-2" style={{ backgroundColor: '#f9fafb', top: '0', zIndex:'1000' }}>
              <TopicSlider topics={topics} onTopicSelect={handleTopicSelect} activeTopic={activeTopic} itemClassName={' topic-link border-bottom'} />
            </div>

            <Card activeTopic={activeTopic} /> 
          </div>

          {/* Right Sidebar */}
          <div className="col-12 col-lg-4" style={{ paddingLeft: '50px', borderLeft: '1px solid #eaeaea', paddingRight: '5rem' }}>
            <div className="position-sticky top-0">
              <SideSection />
              <Footer className={'justify-content-between'} style={{ fontSize: '13px' }} />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default HomePage
