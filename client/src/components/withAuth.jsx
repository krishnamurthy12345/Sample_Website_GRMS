//
// NAME:			  withAuth.jsx
// AUTHOR:			Krishna Murthy
// COMPANY:			GDI Nexus
// DATE:			  21/12/2025
// PURPOSE:			Once token get in LocalStorage then route the particular page
//

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (Component) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      console.log("accessToken", token);
      if (!token) {
        navigate("/");
      }
    }, [navigate]);

    return localStorage.getItem("accessToken") ? <Component {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;
