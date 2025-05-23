import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { signin, authenticate, isAuthenticated } from '../auth'

const Login = () => {

  const navigate = useNavigate()
  const { user } = isAuthenticated()

  const handleClose = () => {
    navigate('/')
  }

  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    success: false,
    redirectToPage: false
  })
  // object destructuring
  const { email, password, error, success, redirectToPage } = values

  // name = all the values
  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setValues({ ...values })

    signin({ email, password })
      .then(data => {
        if (data.error) {
          setValues({ ...values, error: data.error })
        }
        else {
          authenticate(data, () => {
            setValues({
              ...values, redirectToPage: true
            })
          })
        }
      })

  }

  // showing error
  const showError = () => (
    <div className='alert alert-danger w-50 m-auto' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  // redirecting user
  const redirectUser = () => {
    const redirect = '/home'
    if (redirectToPage) {
      if (user && user.role === 1) {
        return navigate('/admin/dashboard')
      }
      else {
        return <Navigate to={redirect} />
      }
    }
  }

  return (
    <>
      <div className="container-fluid d-flex justify-content-between position-relative">
        <button type="button" className=" btn-close" aria-label="Close" onClick={handleClose} style={{ position: 'absolute', top: '20px', right: '30px' }}> </button>

        <div className=''>
          <img src='/img/b1.png' alt='' className='img-fluid' />
        </div>

        <div className="text-center w-50 m-auto">
          <h2>Welcome Back</h2>
          <p>Sign into your account</p>

          {showError()}
          {redirectUser()}

          <form className='w-75 m-auto mb-3 mt-5' style={{ borderBottom: '2px solid black' }}>
            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="email" placeholder="name@example.com" onChange={handleChange('email')} value={email} />
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input type="password" className="form-control" id="password" placeholder="Password" onChange={handleChange('password')} value={password} />
              <label htmlFor="password">Password</label>
            </div>
            <div className="col-12 mb-3">
              <button type="submit" className="btn btn-primary" onClick={handleSubmit} >Sign in</button>
            </div>
            <div className='mb-2'>
              <Link to='/forgot-password' className='link-button'>Forgot Password?</Link>
            </div>
          </form>

          <p>
            Don't have an account?{" "} <br />
            <Link to='/register' className='link-button text-decoration-underline'>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;