//
// NAME:			  App.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			All component import To User's Dispaly
//


import React from 'react';
import withAuth from '../withAuth';

const Profile = () => {
  return (
    <div>Profile</div>
  )
}

export default withAuth(Profile);