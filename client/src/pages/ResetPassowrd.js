// ResetPassword.jsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ResetPassword } from '../auth'
import { Link } from 'react-router-dom'
import { PiLockKeyOpen } from "react-icons/pi"

const ResetPasswordPage = () => {
    const { token } = useParams()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        try {
            ResetPassword(password, token)
                .then((data) => {
                    if (data.error) {
                        setError(data.error)
                    } else {
                        setMessage('Password has been reset successfully.')
                        setPassword('')
                    }
                })
        } catch (err) {
            setError('Network error.')
        }
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-body align-content-center p-5" style={{ minHeight: '60dvh' }}>
                                <div className="text-center mb-5">
                                    <PiLockKeyOpen size={120} className="mb-2 text-primary" />
                                    <h5 className="card-title text-decoration-underline">Reset Password</h5>
                                </div>

                                <form onSubmit={handleResetPassword}>
                                    <div className="mb-4 w-75 mx-auto">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter new password"
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4 w-75 mx-auto">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            required
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-grid w-75 mx-auto">
                                        <button type="submit" className="btn btn-success">
                                            Reset Password
                                        </button>
                                    </div>
                                </form>

                                {message && <p className="text-success mt-3 text-center">{message}</p>}
                                {error && <p className="text-danger mt-3 text-center">{error}</p>}

                                <div className="text-center mt-4">
                                    <Link to="/" className="text-decoration-none">← Back to Home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPasswordPage
