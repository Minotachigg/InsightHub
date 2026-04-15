import React, { useState, useEffect} from 'react'
import { data, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const EmailVerify = () => {
    const API = process.env.REACT_APP_API_URL;
    const params = useParams()
    const [values, setValues] = useState({
        error: '',
        success: false
    })
    const {error, success} = values

    // verifyin email
    useEffect(() => {
        const token = params.token
        fetch(`${API}/confirmation/${token}`,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                setValues({...values, error: data.error})
            }
            else{
                setValues({
                    ...values,
                    error: '',
                    success: true
                })
            }
        })
        .catch(err=>console.log(err))

    }, [params.token])


    // showing error
  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error} 
    </div>
  )

  // showing success
  const showSuccess = () => (
    <div className='alert alert-success' style={{ display: success ? '' : 'none' }}>
        Your email has been verified. Please <Link to='/signin'>Signin</Link>
    </div>
  )


  return (
    <>
    <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3'>
                {showError()}
                {showSuccess()}
            </div>
        </div>
    </div>
    </>
  )
}

export default EmailVerify