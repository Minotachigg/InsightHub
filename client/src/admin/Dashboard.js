import React from 'react'
import { isAuthenticated } from '../auth'
import AdminSidebar from './AdminSidebar'
import ProfileIcon from '../components/ProfileIcon'

const Dashboard = () => {

  const { user } = isAuthenticated()
  return (
    <>
      <AdminSidebar />
      <div className="content">
        {/* <!-- Admin Info --> */}
        <div className="admin-info">
          <span>Welcome, <strong>Admin</strong></span>
          <ProfileIcon name={user.name}/>
        </div>

        {/* <!-- Dashboard Cards --> */}
        <h2 className="mb-4">Dashboard Overview</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card p-4">
              <h5>Total Blogs</h5>
              <h2>124</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4">
              <h5>Total Users</h5>
              <h2>56</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4">
              <h5>Comments</h5>
              <h2>342</h2>
            </div>
          </div>
        </div>

        {/* <!-- Recent Activity Table --> */}
        <div className="mt-5">
          <h4>Recent Activity</h4>
          <table className="table table-striped mt-3">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Activity</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice</td>
                <td>Posted a new blog</td>
                <td>2 hours ago</td>
              </tr>
              <tr>
                <td>Bob</td>
                <td>Commented on a post</td>
                <td>5 hours ago</td>
              </tr>
              <tr>
                <td>Charlie</td>
                <td>Joined</td>
                <td>Yesterday</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dashboard