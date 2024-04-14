// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#D3D3D3" }}>
      <div className="container-fluid">
        <Link className="navbar-brand fs-1 " to="/">Taskify</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link fs-4 mx-2" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-4 mx-2" to="/tasks">Tasks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-4 mx-2" to="/completed">Completed</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-4 mx-2" to="/inprogress">In Progress</Link>
            </li><li className="nav-item">
              <Link className="nav-link fs-4 mx-2" to="/todo">To Do</Link>
            </li>
            {/* Add more navigation links as needed */}
          </ul>

        </div>
        <div className="collapse navbar-collapse mx-auto nav-item " id="navbarNavAltMarkup">
          {localStorage.getItem("authToken")?<Link to="/login"><button className='btn btn-danger ' >Logout</button></Link>:
          <Link to="/login"><button onClick={localStorage.removeItem("authToken")} className='btn btn-danger '>Login</button></Link>}
        </div>
      </div>
    </nav>
  );
}
