// ForgotPassword.jsx
import React, { useState, useEffect } from 'react'
import { ForgotPassword } from '../auth'
import { Link } from 'react-router-dom'
import { PiLockKey } from "react-icons/pi"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isCooldown, setIsCooldown] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      ForgotPassword(email)
        .then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setMessage('Password reset link sent to your email.')
            setIsCooldown(true)
            setCountdown(60)
          }
        })
    }
    catch (err) {
      console.error('Error sending reset link:', err)
      setError('An error occurred while sending the reset link. Please try again later.')
    }
  }

  // Countdown timer effect
  useEffect(() => {
    if (!isCooldown) return

    if (countdown === 0) {
      setIsCooldown(false)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, isCooldown])

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body align-content-center p-5" style={{ minHeight: '60dvh' }}>
                <div className="text-center mb-5">
                  <PiLockKey size={100} className='mb-2 text-secondary' />
                  <h5 className="card-title text-center text-decoration-underline">Forgot Password</h5>
                </div>
                <form onSubmit={handleForgotPassword}>
                  <div className='text-center'>
                    {message && <p className="text-success mt-3">{message}</p>}
                    {error && <p className="text-danger mt-3">{error}</p>}
                  </div>
                  <div className="mb-4 w-75 mx-auto">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="d-grid w-75 mx-auto">
                    <button type="submit" className="btn btn-primary" disabled={isCooldown}>
                      {isCooldown ? `Try again in ${countdown}s` : 'Send Reset Link'}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-5">
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

export default ForgotPasswordPage
