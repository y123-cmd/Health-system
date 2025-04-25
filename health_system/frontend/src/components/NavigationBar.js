import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Health Information System</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clients">Clients</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/programs">Health Programs</Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link className="btn btn-outline-light me-2" to="/clients/new">
              Register Client
            </Link>
            <Link className="btn btn-outline-light" to="/programs/new">
              Create Program
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;