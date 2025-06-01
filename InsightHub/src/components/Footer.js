import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({ className, style }) => {
    return (
        <>
            <div className="py-3 border-top ">
                <ul className={`nav d-flex justify-content-center ${className}`} style={{ ...style }}>
                    <li className="nav-item">
                        <Link className="nav-link" href="#">Help</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="#">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="#">Privacy</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="#">Terms</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="#">Teams</Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Footer