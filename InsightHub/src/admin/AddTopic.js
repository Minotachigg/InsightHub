import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import { addTopic } from './apiIndex'
import { isAuthenticated } from '../auth'

const AddTopic = () => {

    const [topic_name, setTopic] = useState('')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    // destructure token
    const { token } = isAuthenticated()

    const handleChange = e => {
        setError('')
        setTopic(e.target.value.toLowerCase())
    }

    const handlleSubmit = e => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        // make request to add topic
        addTopic(token, { topic_name })
            .then(data => {
                if (data.error) {
                    setError(data.error)
                }
                else {
                    setError('')
                    setSuccess(true)
                }
            })
    }

    // showing error
    const showError = () => (
        <div className='alert alert-danger w-50 m-auto' style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )

    // showing success
    const showSuccess = () => (
        <div className='alert alert-success w-50 m-auto' style={{ display: success ? '' : 'none' }}>
            New Topic added.
        </div>
    )

    return (
        <>
            <div className="wrapper d-flex align-items-stretch w-100">
                <AdminSidebar />
                <div className='container'>
                    <div className='row d-flex justify-content-center'>
                        <div className='col-md-6'>
                            <form action="">
                                <h2 className='text-center'>Add Topic</h2>
                                {showError()}
                                {showSuccess()}
                                <div className='my-3'>
                                    <label htmlFor="topic">Topic Name</label>
                                    <input type="text" name='topic' id='topic' className='form-control' onChange={handleChange} value={topic_name}/>
                                </div>
                                <div className='mt-3'>
                                    <button className='btn btn-primary' onClick={handlleSubmit}>Add Topic</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTopic