import React from 'react'
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom'
import { isAuthenticated, signout } from '../auth'
import ProfileIcon from './ProfileIcon'

const Header = () => {
    const { user } = isAuthenticated()
    const navigate = useNavigate()

    const location = useLocation()
    const isWritePage = location.pathname === '/write'

    return (
        <>
            <div id="navbar" className=" border-bottom" style={{ fontSize: '.9rem' }}>
                <nav className="container d-flex justify-content-between align-items-center">
                    <div id="logo">
                        {
                            // if the user is logged in then 1st, if not 2nd
                            user ? (
                                <h2 className="nav-item">
                                    <Link className="nav-link" to="/home">InsightHub</Link>
                                </h2>
                            ) : (
                                <h2 className="nav-item">
                                    <Link className="nav-link" to="/">InsightHub</Link>
                                </h2>
                            )
                        }

                    </div>
                    <ul className="nav">

                        {!isWritePage && (
                            <>
                                <li className="nav-item">
                                    <NavLink  to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} >Our Stories</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink  to="/exploretopics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} >Explore Topics</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink  to="/write" className="nav-link" >Write</NavLink>
                                </li>
                            </>
                        )}

                        {/* if the user is logged in and in write page, then the publish button is shown */}
                        {isWritePage && user && (
                            <li className="nav-item">
                                <div className="btn">
                                    {/* Publish button with function submit for write page */}
                                    <button
                                        type="button"
                                        className=" btn btn-success px-3 py-1"
                                        style={{ backgroundColor: '#0b661e' }}
                                        onClick={() => {
                                            const confirmed = window.confirm("Are you sure you want to publish this blog?")
                                            if (confirmed) {
                                                // Dispatching custom event to trigger form submission on the Write page
                                                window.dispatchEvent(new Event("submitBlog"))
                                            }
                                        }}>
                                        Publish
                                    </button>
                                </div>
                            </li>
                        )}


                        {user && (
                            <li className="nav-item dropdown position-relative">
                                <button
                                    className="nav-link d-flex align-items-center gap-1 cursor-pointer"
                                    onClick={() => {
                                        const menu = document.getElementById('profile-dropdown')
                                        menu.classList.toggle('d-none')
                                    }}
                                >
                                    <ProfileIcon name={user.name} style={{ width: '2rem', height: '2rem' }} />
                                </button>
                                <ul id="profile-dropdown" className="dropdown-menu d-none position-absolute mt-2" style={{ top: '100%', right: 0, zIndex: 1000, display: 'block' }}>

                                    {user.role === 1 && (
                                        <li style={{ fontSize: '0.9rem' }}>
                                            <Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link>
                                            <Link className="dropdown-item" to="/profile">Profile</Link>
                                            <Link className="dropdown-item" to="/profile/edit">Reading List</Link>
                                            <Link className="dropdown-item mb-1" to="/profile/edit">Edit Profile</Link>
                                        </li>
                                    )}
                                    {user.role === 0 && (
                                        <li style={{ fontSize: '0.9rem' }}>
                                            <Link className="dropdown-item" to={`/profile`}>Profile</Link>
                                            <Link className="dropdown-item" to={`/profile/bookmarks`}>Bookmarks</Link>
                                        </li>
                                    )}
                                    <li>
                                        <div className=" dropdown-item text-danger px-3 pt-2 border-top" onClick={() => { signout(() => { navigate('/') }) }}>
                                            Logout
                                        </div>
                                    </li>

                                </ul>
                            </li>
                        )}


                        {!user && !isWritePage && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/signin" >Sign In</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button className='btn'>
                                        <Link className="nav-link text-white" to="/register">Get started</Link>
                                    </button>
                                </li>
                            </>
                        )}

                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Header