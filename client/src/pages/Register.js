import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../auth'

const Register = () => {

  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  })
  // object destructuring
  const { name, email, password, error, success } = values
  
  // name = all the values
  const handlelChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setValues({...values})
    // signup fucntion
    signup({ name, email, password })
    .then(data => {
      if(data.error){
        setValues({...values, error: data.error})
      }
      else{
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true
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

  // showing success
  const showSuccess = () => (
    <div className='alert alert-success w-50 m-auto' style={{ display: success ? '' : 'none' }}>
      New account is created. Please <Link to='/signin'>Signin</Link>
    </div>
  )

  return (
    <>
      <div className="container-fluid d-flex justify-content-between position-relative">
        <button type="button" className="btn btn-close" aria-label="Close" onClick={handleClose} style={{ position: 'absolute', top: '20px', right: '30px' }}></button>

        <div className='w-50'>
          <img src='/img/b1.png' alt='' className='img-fluid' />
        </div>

        <div className="text-center w-50 m-auto">
          <h2>Register</h2>
          <p>Create your new account</p>

          {showError()}
          {showSuccess()} 

          <form className='w-75 m-auto mb-3 mt-5' style={{ borderBottom: '2px solid black' }}>
            <div className="form-floating mb-3">
              <input type='text' className="form-control" id="floatingInput" placeholder="john..." onChange={handlelChange('name')} value={name} />
              <label htmlFor="floatingInput">UserName</label>
            </div>
            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="email" placeholder="name@example.com" onChange={handlelChange('email')} value={email} />
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input type="password" className="form-control" id="password" placeholder="Password" onChange={handlelChange('password')} value={password} />
              <label htmlFor="password">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input type="password" className="form-control" id="cpassword" placeholder="Password" />
              <label htmlFor="cpassword">Confirm Password</label>
            </div>
            <div className="col-12 mb-3">
              <button type="submit" className="btn btn-primary" onClick={handleSubmit} >Register</button>
            </div>
          </form>

          <p>
            Already have an account? <br />
            <Link to='/signin' className='link-button text-decoration-underline'>Sign in now</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Register