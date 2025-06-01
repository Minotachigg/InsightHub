import React, { useState, useEffect, } from 'react'
import { FaTrash } from "react-icons/fa6"
import axios from 'axios'
import { API } from '../config'
import AdminSidebar from './AdminSidebar'

const Topics = () => {

    const [topics, setTopics] = useState([])
    useEffect(() => {
        axios.get(`${API}/topiclist`)
            .then(res => {
                setTopics(res.data)
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <>
            <div className="wrapper d-flex align-items-stretch w-100">
                <AdminSidebar />
                <div className="container mt-4">
                    <h3 className="mb-4">All Users</h3>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <table className="table table-bordered table-striped text-center">
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th>Topic Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topics && topics.map((topic, i) => (
                                        <tr key={i}>
                                            <td className='text-capitalize'> {topic.topic_name} </td>
                                            <td><button className='btn btn-danger'><FaTrash /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Topics