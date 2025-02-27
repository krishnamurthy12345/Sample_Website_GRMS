//
// NAME:			  Dashboard.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			Dashboard Page To User's Dispaly
//

// imports
import React, { useEffect, useState } from 'react';
import withAuth from '../withAuth';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // Extract the given name from the token
        const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || "User";
        setUserName(name);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    // Get current date and day
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-GB')); // e.g., "01/01/2025"
    setCurrentDay(today.toLocaleDateString('en-US', { weekday: 'long' })); // e.g., "Tuesday"

  }, []);

  return (
    <div className="p-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
        <p className="text-gray-600">{currentDate} &bull; {currentDay}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-4 gap-6">
        <div className="bg-orange-500 text-white shadow-md rounded-lg p-5 text-center cursor-pointer hover:shadow-lg transition">
          <h5 className="text-lg font-semibold">Total Customers</h5>
          <p className="text-2xl font-bold">20</p>
        </div>

        <div className="bg-violet-500 text-white shadow-md rounded-lg p-5 text-center">
          <h5 className="text-lg font-semibold">Leads</h5>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-pink-500 text-white shadow-md rounded-lg p-5 text-center">
          <h5 className="text-lg font-semibold">Calendar</h5>
        </div>

        <div className="bg-slate-500 text-white shadow-md rounded-lg p-5 text-center">
          <h5 className="text-lg font-semibold">Tasks</h5>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
