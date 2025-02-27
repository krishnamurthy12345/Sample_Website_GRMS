//
// NAME:			  authMonitor.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  02/26/2025
// PURPOSE:			User's Auth Integration Monitor for Auto Logout
//

import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

const AUTO_LOGOUT_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const resetActivityTimer = () => {
  localStorage.setItem("lastActivity", Date.now());
};

const checkInactivity = () => {
  const lastActivity = localStorage.getItem("lastActivity");
  const token = localStorage.getItem("accessToken");

  if (token && lastActivity) {
    const elapsedTime = Date.now() - parseInt(lastActivity, 10);

    if (elapsedTime >= AUTO_LOGOUT_TIME) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("lastActivity");

      toast.warn("Session expired! You have been logged out.", {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        window.location.href = "/"; // Redirect after showing toast
      }, 3000);
    }
  }
};

const AuthMonitor = () => {
  useEffect(() => {
    const setupInactivityListeners = () => {
      window.addEventListener("mousemove", resetActivityTimer);
      window.addEventListener("keypress", resetActivityTimer);
      window.addEventListener("click", resetActivityTimer);
      resetActivityTimer();
    };

    setupInactivityListeners();
    const interval = setInterval(checkInactivity, 60 * 1000);

    return () => {
      window.removeEventListener("mousemove", resetActivityTimer);
      window.removeEventListener("keypress", resetActivityTimer);
      window.removeEventListener("click", resetActivityTimer);
      clearInterval(interval);
    };
  }, []);

  return <ToastContainer />; // ✅ Render ToastContainer
};

export default AuthMonitor;
