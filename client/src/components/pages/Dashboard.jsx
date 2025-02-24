//
// NAME:			  Dashboard.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			Dashboard Page To User's Dispaly
//

// imports
import React from 'react';
import { useLocation } from 'react-router-dom';
import withAuth from '../withAuth';

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  if (token) {
    localStorage.setItem('token', token); 
  }
  return (
    <div>Dashboard</div>
  )
}

export default withAuth(Dashboard);