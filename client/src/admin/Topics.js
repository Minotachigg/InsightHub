import React, { useState, useEffect, } from 'react'
import { FaTrash } from "react-icons/fa6"
import axios from 'axios'
import AdminSidebar from './AdminSidebar'

const Topics = () => {
    const API = process.env.REACT_APP_API_URL;
    const [topics, setTopics] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        axios.get(`${API}/topiclist`)
            .then(res => {
                setTopics(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const confirmDelete = (id) => {
        setDeleteId(id)
        setShowConfirm(true)
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            console.log('Deleting topic with id:', deleteId)
            await axios.delete(`${API}/deletetopic/${deleteId}`)
            setTopics(topics.filter(topic => topic._id !== deleteId))
            setShowConfirm(false)
        } catch (err) {
            console.error(err)
            alert("Error deleting blog")
        }
    }

    return (
        <>
            <div className="wrapper d-flex">
                <AdminSidebar />
                <main className="content p-4 w-75">
                    <div style={{ marginLeft: "20%" }}>
                        <h3 className="mb-4 text-dark">All Topics</h3>
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
                                        <td className="text-capitalize">{topic.topic_name}</td>
                                        <td>
                                            <button
                                                aria-label={`Delete topic ${topic.topic_name}`}
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => confirmDelete(topic._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Confirmation Modal */}
                        {showConfirm && (
                            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="confirmDeleteTitle" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 id="confirmDeleteTitle" className="modal-title">Confirm Delete</h5>
                                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowConfirm(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            Are you sure you want to delete this blog? This action cannot be undone.
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

        </>
    )
}

export default Topics