import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import ReadingList from '../components/ReadingList'
import UserWorks from '../components/UserWorks'
import ProfileIcon from '../components/ProfileIcon'
import { isAuthenticated } from '../auth'
import Footer from '../components/Footer'

const Profile = () => {
    const user = isAuthenticated() // Ensure this contains the user object with name
    const name = user.user.name
    const email = user.user.email

    const location = useLocation()
    const currentTab = location.pathname.includes('bookmarks') ? 'bookmarks' : 'home'


    return (
        <>
            <Header />
            <div className="container py-4">
                <div className="row gx-5 d-flex flex-grow-1">

                    {/* Left Content */}
                    <div className="col-12 col-lg-8 pe-lg-5" style={{ paddingRight: '50px' }}>
                        <div className=" pt-2 px-5">
                            <div className=' shadow-sm rounded-3 mb-4'
                                style={{
                                    backgroundImage: 'linear-gradient(to bottom,rgba(204, 204, 204, 0.31),rgba(223, 223, 223, 0.47))',
                                    width: '100%',
                                    height: '5rem',
                                    borderRadius: '1rem',
                                }}>

                            </div>

                            {/* Tabs */}
                            <ul className="nav nav-tabs mb-3 position-sticky top-0 z-1">
                                <li className="nav-item me-1">
                                    <Link to="/profile" className={`profile-link bg-transparent nav-link text-dark border-0 ${currentTab === 'home' ? 'active' : ''}`} >
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link to="/profile/bookmarks" className={`profile-link bg-transparent nav-link text-dark border-0 ${currentTab === 'bookmarks' ? 'active' : ''}`} >
                                        Reading List
                                    </Link>
                                </li>
                            </ul>

                            {/* Tab Content */}
                            <Routes>
                                <Route index element={<UserWorks />} />
                                <Route path="bookmarks" element={<ReadingList />} />
                            </Routes>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-12 col-lg-4 d-flex flex-column"
                        style={{
                            borderLeft: '1px solid #eaeaea',
                            paddingRight: '5rem',
                            height: '90dvh',
                            position: 'sticky',
                            bottom: '0',
                        }}
                    >
                        <div className="p-4 flex-grow-1">
                            {/* Profile Icon */}
                            <ProfileIcon
                                name={name}
                                style={{ width: '6rem', height: '6rem', fontSize: '3rem' }}
                            />
                            <div className="mt-3">
                                <h5 className="mb-3 text-capitalize fs-4">{name}</h5>
                                <p> {email} </p>
                                <Link to="/profile/edit" className="mt-2 text-success" style={{ fontSize: '13px' }}>
                                    Edit Profile
                                </Link>
                            </div>
                        </div>

                        <div className="p-4">
                            <Footer className="justify-content-between" style={{ fontSize: '12px' }} />
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Profile
