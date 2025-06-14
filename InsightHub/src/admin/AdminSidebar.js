import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaBars, FaUsers } from "react-icons/fa"
import { IoSpeedometerOutline } from "react-icons/io5"
import { GrArticle } from "react-icons/gr"
import { MdOutlineFormatColorText, MdOutlineTextIncrease, MdLogout } from "react-icons/md"
import { signout } from '../auth'

const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev)
    }

    const navigate = useNavigate()

    const handleLogout = async () => {
        await signout(() => {
            navigate('/login')
        })
    }

    return (
        <>
            <div className={`sidebar d-flex flex-column ${sidebarOpen ? '' : 'collapsed'}`} id="sidebar">
                <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom border-secondary">
                    <h4 className="text-white m-0">Admin</h4>
                    {/* Button to toggle sidebar */}
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                </div>

                {/* Using NavLink for active route styling */}
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <IoSpeedometerOutline size={20}/><span className="nav-label">Dashboard</span>
                </NavLink>
                <NavLink to="/admin/bloglist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <GrArticle size={20}/> <span className="nav-label">Blogs</span>
                </NavLink>
                <NavLink to="/admin/topiclist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <MdOutlineFormatColorText size={20}/> <span className="nav-label">Topics</span>
                </NavLink>
                <NavLink to="/admin/addtopic" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <MdOutlineTextIncrease size={20}/> <span className="nav-label">Add Topic</span>
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <FaUsers size={20}/> <span className="nav-label">Users</span>
                </NavLink>
                <NavLink to="/signin"  className="nav-link" onClick={handleLogout}>
                    <MdLogout size={20}/> <span className="nav-label">Logout</span>
                </NavLink>
            </div>

            {/* Button to open sidebar when collapsed */}
            {!sidebarOpen && (
                <button id="openSidebarBtn" className="btn btn-dark position-fixed top-0 start-0 m-3" onClick={toggleSidebar}>
                    <FaBars />
                </button>
            )}
        </>
    )
}

export default AdminSidebar
