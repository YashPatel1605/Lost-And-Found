import Footer from "../Footer/Footer";
import LatestItems from "../LatestItem/LatestItem";
import LostSomething from "../LostSomething/LostSomething";
import SimpleEffective from "../SimpleEffective/Effective";
import LoginModal from "../../Modal/LoginModal";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // If 'from' exists in state, it means ProtectedRoute sent them here
    if (location.state?.from) {
      setShowLogin(true);
    }
  }, [location]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    
    // 1. Check if there was an intended destination (e.g., /report)
    // 2. If not, default to "/mypost"
    const destination = location.state?.from || "/mypost";
    
    navigate(destination);
    
    // Optional: Clear the state so the modal doesn't pop up again on refresh
    window.history.replaceState({}, document.title);
  };

  return (
    <>
      <LostSomething />
      <SimpleEffective />
      <LatestItems />
      <Footer />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}