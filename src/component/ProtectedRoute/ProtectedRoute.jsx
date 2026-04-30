// import { Navigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem("token");
//   const location = useLocation();

//   if (!isAuthenticated) {
//     toast.info("Please login first 🔑");
//     // Store the path the user was trying to access (e.g., /report)
//     return <Navigate to="/" state={{ from: location.pathname }} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;



import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();
  const hasNotified = useRef(false);

  useEffect(() => {   
    if (!isAuthenticated && !hasNotified.current) {
      toast.info("Please login first 🔑");
      hasNotified.current = true; 
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {    
    return (
      <Navigate 
        to="/" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  return children;
};

export default ProtectedRoute;