import React, { useEffect, useRef } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { Link, useLocation } from 'react-router-dom'

const TopicSlider = ({ topics = [], onTopicSelect, activeTopic, itemClassName }) => {
  const scrollAmount = 300
  const containerRef = useRef(null)
  const prevButtonRef = useRef(null)
  const nextButtonRef = useRef(null)

  const location = useLocation()
  const isHomePage = location.pathname === '/home'

  useEffect(() => {
    const container = containerRef.current
    const prevButton = prevButtonRef.current
    const nextButton = nextButtonRef.current

    const updateButtons = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth
      prevButton.style.display = container.scrollLeft === 0 ? 'none' : 'flex'
      nextButton.style.display = container.scrollLeft >= maxScrollLeft ? 'none' : 'flex'
    }

    const handleNextClick = () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setTimeout(updateButtons, 300)
    }

    const handlePrevClick = () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      setTimeout(updateButtons, 300)
    }

    nextButton.addEventListener('click', handleNextClick)
    prevButton.addEventListener('click', handlePrevClick)
    container.addEventListener('scroll', updateButtons)

    setTimeout(() => updateButtons(), 300)

    return () => {
      nextButton.removeEventListener('click', handleNextClick)
      prevButton.removeEventListener('click', handlePrevClick)
      container.removeEventListener('scroll', updateButtons)
    }
  }, [scrollAmount])

  return (
    <>
      <div className="slider-wrapper position-relative">
        <button ref={prevButtonRef} className="slider-btn prev" style={{ display: 'none' }} aria-label="Prev">
          <IoIosArrowBack />
        </button>

        <div className="scroll-container" ref={containerRef}>
          {/* For You option */}
          {isHomePage ? (
            <Link
              to="#"
              className={`${itemClassName} scroll-item text-dark text-capitalize ${!activeTopic ? 'active-topic' : ''}`}
              onClick={() => onTopicSelect(null)}
            >
              For You
            </Link>
          ) : (
            <Link
              to="/exploretopics"
              className={`${itemClassName} scroll-item text-dark text-capitalize ${!activeTopic ? 'active-topic' : ''}`}
              onClick={() => onTopicSelect(null)}
            >
              Explore Topics
            </Link>
          )}

          {/* Render Topics */}
          {topics.map((topic, i) => (
            <Link
              key={i}
              to={isHomePage ? '#' : `/tag/blogs?topicId=${topic._id}`}
              className={`${itemClassName} scroll-item text-dark text-capitalize ${activeTopic === topic._id ? 'active-topic' : ''}`}
              onClick={() => onTopicSelect(topic._id)}
            >
              {topic.topic_name}
            </Link>

          ))}
        </div>

        <button ref={nextButtonRef} className="slider-btn next" aria-label="Next">
          <IoIosArrowForward />
        </button>
      </div>
    </>
  )
}

export default TopicSlider
