import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '.'

const AdminRoute = () => {
    const auth = isAuthenticated()
    const user = auth?.user

    return user && user.role === 1 ? (
        <Outlet />
    ) : (
        <Navigate to="/signin" />
    )
}

export default AdminRoute