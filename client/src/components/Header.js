import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, signout } from "../auth";
import ProfileIcon from "./ProfileIcon";

const Header = () => {
  const { user } = isAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  const isWritePage = location.pathname === "/write";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signout(() => navigate("/"));
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom px-3">
      {/* LOGO */}
      <Link className="navbar-brand fw-bold" to={user ? "/home" : "/"}>
        InsightHub
      </Link>

      {/* MOBILE TOGGLER */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* COLLAPSIBLE MENU */}
      <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
          {!isWritePage && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">
                  Our Stories
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/exploretopics">
                  Explore Topics
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/write">
                  Write
                </NavLink>
              </li>
            </>
          )}

          {/* PUBLISH BUTTON */}
          {isWritePage && user && (
            <li className="nav-item">
              <button
                className="btn btn-success px-3 py-1"
                style={{ backgroundColor: "#0b661e" }}
                onClick={() => {
                  if (window.confirm("Publish blog?")) {
                    window.dispatchEvent(new Event("submitBlog"));
                  }
                }}
              >
                Publish
              </button>
            </li>
          )}

          {/* USER DROPDOWN */}
          {user && (
            <li className="nav-item position-relative">
              <button
                className="btn nav-link d-flex align-items-center gap-1"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <ProfileIcon
                  name={user.name}
                  style={{ width: "2rem", height: "2rem" }}
                />
              </button>

              <ul
                className={`dropdown-menu position-absolute end-0 mt-2 ${
                  dropdownOpen ? "d-block" : "d-none"
                }`}
                style={{ zIndex: 1000 }}
              >
                {user.role === 1 && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/admin/dashboard">
                        Admin Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile/bookmarks">
                        Reading List
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile/edit">
                        Edit Profile
                      </Link>
                    </li>
                  </>
                )}

                {user.role === 0 && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile/bookmarks">
                        Bookmarks
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <div
                    className="dropdown-item text-danger border-top mt-2 pt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </li>
              </ul>
            </li>
          )}

          {/* GUEST */}
          {!user && !isWritePage && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/signin">
                  Sign In
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link btn text-white" to="/register">
                  Get started
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
