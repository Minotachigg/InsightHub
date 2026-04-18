import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import SideSection from "../components/SideSection";
import TopicSlider from "../components/TopicSlider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const HomePage = () => {
  const API = process.env.REACT_APP_API_URL;
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/topiclist`)
      .then((res) => {
        const randomTopics = res.data
          .sort(() => Math.random() - 0.5)
          .slice(0, 15);
        setTopics(randomTopics);
      })
      .catch((err) => {
        console.error("Error fetching topics:", err);
      });
  }, []);

  const handleTopicSelect = (topicId) => {
    setActiveTopic(topicId);
  };

  return (
    <>
      <Header />

      <div className="container py-3">
        <div className="row gx-3 gx-lg-5">

          {/* LEFT SECTION */}
          <div className="col-12 col-lg-8">

            {/* Sticky Topic Slider (mobile safe) */}
            <div
              className="position-sticky py-2"
              style={{
                backgroundColor: "#f9fafb",
                top: "0",
                zIndex: 1000,
              }}
            >
              <TopicSlider
                topics={topics}
                onTopicSelect={handleTopicSelect}
                activeTopic={activeTopic}
                itemClassName={"topic-link border-bottom"}
              />
            </div>

            <Card activeTopic={activeTopic} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div
            className="col-12 col-lg-4 mt-4 mt-lg-0"
            style={{
              borderLeft: "1px solid #eaeaea",
            }}
          >
            <div className="position-sticky top-0 pt-3 pt-lg-0">

              <SideSection />

              <Footer
                className={"justify-content-between"}
                style={{ fontSize: "13px" }}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default HomePage;