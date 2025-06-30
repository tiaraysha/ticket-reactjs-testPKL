import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div 
      className="d-flex flex-column flex-shrink-0 p-3 text-white" 
      style={{
        width: '240px',
        height: '100vh',
        position: 'fixed',
        backgroundColor: '#1a1a2e',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <div className="d-flex align-items-center mb-4" style={{ padding: '0 0.5rem' }}>
        <i className="bi bi-stack me-2" style={{ fontSize: '1.5rem', color: '#4e73df' }}></i>
        <span 
          className="fs-4 fw-bold" 
          style={{ 
            color: '#fff',
            letterSpacing: '0.5px'
          }}
        >
          Ticket Management
        </span>
      </div>

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link 
            to="/" 
            className="nav-link text-white d-flex align-items-center" 
            style={{
              borderRadius: '6px',
              backgroundColor: 'rgba(78, 115, 223, 0.1)',
              padding: '0.5rem 1rem',
              transition: 'all 0.3s ease'
            }}
            activeStyle={{
              backgroundColor: '#4e73df',
              fontWeight: '500'
            }}
          >
            <i className="bi bi-speedometer2 me-3" style={{ width: '20px' }}></i>
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/ticket" 
            className="nav-link text-white d-flex align-items-center" 
            style={{
              borderRadius: '6px',
              backgroundColor: 'rgba(78, 115, 223, 0.1)',
              padding: '0.5rem 1rem',
              transition: 'all 0.3s ease'
            }}
            activeStyle={{
              backgroundColor: '#4e73df',
              fontWeight: '500'
            }}
          >
            <i className="bi bi-house-door me-3" style={{ width: '20px' }}></i>
            Index
          </Link>
        </li>
      </ul>

      {/* Footer (optional) */}
      <div className="mt-auto pt-3 border-top" style={{ borderColor: '#2a2a3a !important' }}>
        <div className="text-muted small">
          <i className="bi bi-info-circle me-1"></i> v1.0.0
        </div>
      </div>
    </div>
  );
}
