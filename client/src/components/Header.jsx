//
// NAME:			  Header.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/12/2025
// PURPOSE:			Login Page To User's Dispaly
//

// imports
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // Convert token to boolean
  }, []);
  

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home after logout
  };

  return (
    <header className="bg-slate-800 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">Logo</div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* Navigation Links */}
        <ul
          className={`md:flex md:items-center absolute md:static top-16 right-0 w-[200px] bg-gray-800 md:bg-transparent md:w-auto md:space-x-6 transition-all duration-300 ${
            menuOpen ? "flex flex-col" : "hidden"
          }`}
        >
          {isLoggedIn ? (
            <>
              <li className="py-2 lg:py-0 text-center">
                <Link
                  to="/dashboard"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Dashboard
                </Link>
              </li>
              <li className="py-2 lg:py-0 text-center">
                <Link
                  to="/notification"
                  className="text-white no-underline hover:bg-gray-600 rounded px-4 py-2 block"
                >
                  Notification
                </Link>
              </li>

              {/* Profile Dropdown */}
              <li
                className="relative py-2 lg:py-0 text-center lg:text-left"
                ref={dropdownRef}
              >
                <button
                  className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Profile ▼
                </button>
                <ul
                  className={`absolute lg:right-0 bg-white shadow-md rounded-md w-40 mt-2 transition-all duration-300 ${
                    dropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <li>
                    <Link
                      to="/profile"
                      className="block no-underline px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                  </li>
                  <li
                    onClick={handleLogout}
                    className="block no-underline px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <li className="py-2 lg:py-0 text-center">
              <Link
                to="/"
                className="text-white hover:bg-gray-600 rounded px-4 py-2 block"
              >
                Home
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
