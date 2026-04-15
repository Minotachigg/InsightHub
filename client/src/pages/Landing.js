import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'

const Landing = () => {
  const { user } = isAuthenticated()
  return (
    <>
      <div id="banner" className="container-fluid overflow-hidden d-flex" style={{ borderBottom: '1.5px solid black', borderTop: '1.5px solid black' }}>
        <div id="banner_text" className="my-auto w-75">
          <h1 className="text-capitalize mb-5"> Inspiring Stories, <br /> Insights & Ideas</h1>
          <p className="mb-5 fs-4">Discover, Share, and Learn: Dive into Human Stories and Ideas</p>

          {user && (
            <button>
              <Link to='/home' className='btn text-white'>Start Reading</Link>
            </button>
          )}

          {!user && (
            <button>
              <Link to='/signin' className='btn text-white'>Start Reading</Link>
            </button>
          )}

        </div>
        <div className="img_banner">
          <img src='/img/b1.png' alt="Banner" className='img-fluid' loading='lazy' />
        </div>
      </div>
    </>
  )
}

export default Landing