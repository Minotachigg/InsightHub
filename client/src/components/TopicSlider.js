import React, { useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const TopicSlider = ({
  topics = [],
  onTopicSelect,
  activeTopic,
  itemClassName,
}) => {
  const scrollAmount = 300;
  const containerRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const location = useLocation();
  const isHomePage = location.pathname === "/home";

  useEffect(() => {
    const container = containerRef.current;
    const prevButton = prevButtonRef.current;
    const nextButton = nextButtonRef.current;

    if (!container || !prevButton || !nextButton) return;

    const updateButtons = () => {
      const maxScrollLeft =
        container.scrollWidth - container.clientWidth;

      prevButton.style.display =
        container.scrollLeft <= 0 ? "none" : "flex";

      nextButton.style.display =
        container.scrollLeft >= maxScrollLeft ? "none" : "flex";
    };

    const handleNextClick = () => {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(updateButtons, 300);
    };

    const handlePrevClick = () => {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setTimeout(updateButtons, 300);
    };

    nextButton.addEventListener("click", handleNextClick);
    prevButton.addEventListener("click", handlePrevClick);
    container.addEventListener("scroll", updateButtons);

    setTimeout(updateButtons, 200);

    return () => {
      nextButton.removeEventListener("click", handleNextClick);
      prevButton.removeEventListener("click", handlePrevClick);
      container.removeEventListener("scroll", updateButtons);
    };
  }, [scrollAmount]);

  return (
    <div className="slider-wrapper position-relative">

      {/* LEFT ARROW (hide on mobile via CSS recommended) */}
      <button
        ref={prevButtonRef}
        className="slider-btn prev d-none d-md-flex"
        style={{ display: "none" }}
        aria-label="Prev"
      >
        <IoIosArrowBack />
      </button>

      {/* SCROLL AREA */}
      <div
        className="scroll-container d-flex overflow-auto"
        ref={containerRef}
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* For You / Explore */}
        {isHomePage ? (
          <Link
            to="#"
            className={`${itemClassName} scroll-item text-dark text-capitalize ${
              !activeTopic ? "active-topic" : ""
            }`}
            onClick={() => onTopicSelect(null)}
          >
            For You
          </Link>
        ) : (
          <Link
            to="/exploretopics"
            className={`${itemClassName} scroll-item text-dark text-capitalize ${
              !activeTopic ? "active-topic" : ""
            }`}
            onClick={() => onTopicSelect(null)}
          >
            Explore Topics
          </Link>
        )}

        {/* Topics */}
        {topics.map((topic, i) => (
          <Link
            key={i}
            to={
              isHomePage
                ? "#"
                : `/tag/blogs?topicId=${topic._id}`
            }
            className={`${itemClassName} scroll-item text-dark text-capitalize ${
              activeTopic === topic._id ? "active-topic" : ""
            }`}
            onClick={() => onTopicSelect(topic._id)}
          >
            {topic.topic_name}
          </Link>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        ref={nextButtonRef}
        className="slider-btn next d-none d-md-flex"
        aria-label="Next"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default TopicSlider;