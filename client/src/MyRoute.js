import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Layouts from './components/Layouts'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Write from './pages/Write'
import EmailVerify from './auth/EmailVerify'
import AdminRoute from './auth/AdminRoute'
import PrivateRoute from './auth/PrivateRoute'
import Dashboard from './admin/Dashboard'
import AddTopic from './admin/AddTopic'
import Topics from './admin/Topics'
import Bloglist from './admin/Bloglist'
import BlogDetails from './pages/BlogDetails'
import UserList from './admin/UserList'
import HomePage from './pages/HomePage'
import TopicList from './pages/ExploreTopics'
import TopicBlogs from './pages/TagBlogs'
import NotFound from './pages/NotFound'
import EditBlog from './pages/EditBlog'
import ResetPasswordPage from './pages/ResetPassowrd'
import ForgotPasswordPage from './pages/ForgotPasword'

const MyRoute = () => {
    return (
        <Router>
            <Routes>

                {/* PUBLIC LAYOUT */}
                <Route path="/" element={<Layouts />}>
                    <Route index element={<Landing />} />
                    <Route path="blog/:blogId" element={<BlogDetails />} />
                    <Route path="exploretopics" element={<TopicList />} />
                </Route>

                {/* PUBLIC AUTH ROUTES */}
                <Route path="signin" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgotpassword" element={<ForgotPasswordPage />} />
                <Route path="resetpassword/:token" element={<ResetPasswordPage />} />
                <Route path="email/confirmation/:token" element={<EmailVerify />} />

                {/* PRIVATE ROUTES */}
                <Route element={<PrivateRoute />}>
                    <Route path="home" element={<HomePage />} />
                    <Route path="write" element={<Write />} />
                    <Route path="profile/*" element={<Profile />} />
                    <Route path="tag/blogs" element={<TopicBlogs />} />
                    <Route path="edit/:blogId" element={<EditBlog />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="addtopic" element={<AddTopic />} />
                    <Route path="topiclist" element={<Topics />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="bloglist" element={<Bloglist />} />
                </Route>

                {/* CATCH ALL */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </Router>
    )
}

export default MyRoute