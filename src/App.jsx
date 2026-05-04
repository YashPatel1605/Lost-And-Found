import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/NavBar/NavBar";
import Home from "./component/Home/Home";
import Browse from "./component/Browser/Browser";
import Report from "./component/Report/Report";
// import Login from "./component/Login/Login";
import LoginModal from "./Modal/LoginModal";
// import Signup from "./component/Signup/Signup";
import { ToastContainer } from "react-toastify";
// import ItemDetails from "./component/ItemDetails/ItemDetails";
import ItemDetails from "./Modal/ItemDetails";
import MyPosts from "./component/Dashboard/MyPost";
import EditItem from "./component/EditItem/EditItem";
// import ResetPassword from "./component/ResetPassword/ResetPassword";
import ResetPassword from "./component/ResetPassword/ResetPassword";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import ContactAdmin from "./component/Footer/ContactAdmin";
import FAQ from "./component/Footer/FAQ";
import PrivacyPolicy from "./component/Footer/Privacy";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Browse />} />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypost"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/item/:id" element={<ItemDetails/>} /> */}
        <Route path="/edit-item/:id" element={<EditItem />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact" element={<ContactAdmin />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;