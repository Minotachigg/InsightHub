import React from 'react'

const NotFound = () => {
    return (
        <>
            <div className='container align-content-center' style={{ minHeight: '100dvh' }}>
                <div className='d-flex flex-column text-center'>
                    <h1 className='text-danger' style={{ fontSize: '8rem'}}> 404 </h1>
                    <h1 className='text-danger'> PAGE NOT FOUND </h1>
                </div>
            </div>
        </>
    )
}

export default NotFound