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
            <div className="wrapper d-flex">
                <AdminSidebar />
                <main className="content p-4 w-75">
                    <div style={{ marginLeft: "20%" }}>
                        <h3 className="mb-4 text-dark">All Users</h3>
                        <table className="table table-bordered table-striped text-center">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, i) => (
                                        <tr key={i}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center text-muted">No Users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

        </>
    )
}

export default UserList
