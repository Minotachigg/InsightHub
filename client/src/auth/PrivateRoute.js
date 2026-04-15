import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '.'

const PrivateRoute = () => {
    const auth = isAuthenticated()
    const user = auth?.user

    return user ? <Outlet /> : <Navigate to="/signin" />
}

export default PrivateRoute