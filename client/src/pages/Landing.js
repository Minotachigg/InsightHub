import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = isAuthenticated();

  return (
    <>
      <div
        id="banner"
        className="container-fluid overflow-hidden d-flex flex-column flex-lg-row align-items-center"
        style={{
          borderBottom: "1.5px solid black",
          borderTop: "1.5px solid black",
        }}
      >
        {/* TEXT SECTION */}
        <div
          id="banner_text"
          className="my-4 my-lg-auto w-100 w-lg-75 text-center text-lg-start px-3"
        >
          <h1 className="text-capitalize mb-4">
            Inspiring Stories, <br /> Insights & Ideas
          </h1>

          <p className="mb-4 fs-5 fs-lg-4">
            Discover, Share, and Learn: Dive into Human Stories and Ideas
          </p>

          <button
            onClick={() => navigate(user ? "/home" : "/signin")}
            className="btn text-white"
          >
            Start Reading
          </button>
        </div>

        {/* IMAGE SECTION */}
        <div className="img_banner w-100 w-lg-50 text-center">
          <img
            src="/img/b1.png"
            alt="Banner"
            className="img-fluid"
            loading="lazy"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>
      </div>
    </>
  );
};

export default Landing;