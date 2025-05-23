import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../config'
import AdminSidebar from './AdminSidebar'
import { isAuthenticated } from '../auth'

const UserList = () => {
    const [users, setUsers] = useState([])
    const { token } = isAuthenticated()

    useEffect(() => {
        axios.get(`${API}/userlist`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setUsers(res.data)
        })
        .catch(err => {
            console.log(err)
        })

    }, [token])


    return (
        <>
            <div className="wrapper d-flex align-items-stretch w-100">
                <AdminSidebar />
                <div className="container mt-4">
                    <h3 className="mb-4">All Users</h3>
                    <div className="row justify-content-center">
                        <div className="col-md-12"> 
                            <table className="table table-bordered table-striped text-center">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? users.map((user, i) => (
                                        <tr key={i}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No Users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserList
