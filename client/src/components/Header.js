import React, { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { isAuthenticated, signout } from '../auth'
import ProfileIcon from './ProfileIcon'

const Header = () => {
    const { user } = isAuthenticated()
    const navigate = useNavigate()
    const location = useLocation()
    const isWritePage = location.pathname === '/write'

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const handleLogout = () => {
        signout(() => {
            navigate('/')
        })
    }

    return (
        <div id="navbar" className="border-bottom" style={{ fontSize: '.9rem' }}>
            <nav className="container d-flex justify-content-between align-items-center">

                {/* LOGO */}
                <div id="logo">
                    <h2 className="nav-item">
                        <Link className="nav-link" to={user ? "/home" : "/"}>
                            InsightHub
                        </Link>
                    </h2>
                </div>

                {/* NAV LINKS */}
                <ul className="nav align-items-center gap-2">

                    {!isWritePage && (
                        <>
                            <li className="nav-item">
                                <NavLink to="/home" className="nav-link">
                                    Our Stories
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/exploretopics" className="nav-link">
                                    Explore Topics
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/write" className="nav-link">
                                    Write
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* PUBLISH BUTTON */}
                    {isWritePage && user && (
                        <li className="nav-item">
                            <button
                                type="button"
                                className="btn btn-success px-3 py-1"
                                style={{ backgroundColor: '#0b661e' }}
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to publish this blog?")) {
                                        window.dispatchEvent(new Event("submitBlog"))
                                    }
                                }}
                            >
                                Publish
                            </button>
                        </li>
                    )}

                    {/* AUTH USER DROPDOWN */}
                    {user && (
                        <li className="nav-item position-relative">
                            <button
                                className="btn nav-link d-flex align-items-center gap-1"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <ProfileIcon
                                    name={user.name}
                                    style={{ width: '2rem', height: '2rem' }}
                                />
                            </button>

                            <ul
                                className={`dropdown-menu position-absolute mt-2 ${dropdownOpen ? 'd-block' : 'd-none'}`}
                                style={{ top: '100%', right: 0, zIndex: 1000 }}
                            >
                                {user.role === 1 && (
                                    <>
                                        <li><Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link></li>
                                        <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                        <li><Link className="dropdown-item" to="/profile/bookmarks">Reading List</Link></li>
                                        <li><Link className="dropdown-item" to="/profile/edit">Edit Profile</Link></li>
                                    </>
                                )}

                                {user.role === 0 && (
                                    <>
                                        <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                        <li><Link className="dropdown-item" to="/profile/bookmarks">Bookmarks</Link></li>
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

                    {/* GUEST USER */}
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
            </nav>
        </div>
    )
}

export default Header