import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser, loginUser } from "../component/authApi/authApi";
import { toast } from "react-toastify";
import ForgotPassword from "../component/ForgetPassword/ForgetPassword";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState("login"); 

  // Validation Schemas
  const SignupSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    enrollment: Yup.string()
      .matches(/^[0-9]{12}$/, "Enrollment must be exactly 12 digits")
      .required("Enrollment No. is required"),
    email: Yup.string().email("Invalid email").required("Required"),
    contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
      .required("Required"),
    branch: Yup.string().required("Branch is required"),
    password: Yup.string().min(8, "Min 8 chars").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const LoginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  if (!isOpen) return null;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let res;
      if (view === "signup") {
        const payload = {
          name: values.name,
          enrollmentNo: values.enrollment,
          email: values.email,
          contactNumber: values.contact,
          password: values.password,
          branch: values.branch,
          confirmPassword: values.confirmPassword,
        };
        res = await registerUser(payload);
        if (res?.data?.status === false) return toast.error(res.data.message);
        
        toast.success("Signup Successful! Please log in. ✅");
        setView("login");
        resetForm();
      } else {
        res = await loginUser({ email: values.email, password: values.password });      
        const data = res?.data?.data || res?.data;
        const token = data?.token;
        if (token) localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Welcome back! ✅");
        resetForm();
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Authentication failed ❌";
      toast.error(msg);
      if (msg.toLowerCase().includes("register")) setView("signup");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {view === "forgot" ? "Reset Access" : "Welcome to CampusFind"}
          </h2>
          <button onClick={onClose} className="bg-gray-100 hover:bg-red-100 p-2 rounded-full transition-colors">
            ✕
          </button>
        </div>

        {/* View Content */}
        {view === "forgot" ? (
          <ForgotPassword onBack={() => setView("login")} />
        ) : (
          <>
            {/* Tab Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6 border border-gray-200">
              <button
                onClick={() => setView("login")}
                className={`w-1/2 py-2.5 rounded-xl font-semibold transition-all ${
                  view === "login" ? "bg-white shadow-md text-blue-600" : "text-gray-500"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setView("signup")}
                className={`w-1/2 py-2.5 rounded-xl font-semibold transition-all ${
                  view === "signup" ? "bg-white shadow-md text-blue-600" : "text-gray-500"
                }`}
              >
                Sign Up
              </button>
            </div>

            <Formik
              initialValues={{ name: "", enrollment: "", email: "", contact: "", branch: "", password: "", confirmPassword: "" }}
              validationSchema={view === "signup" ? SignupSchema : LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {view === "signup" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Field name="name" placeholder="Full Name" className="input" />
                        <ErrorMessage name="name" component="div" className="error" />
                      </div>
                      <div>
                        <Field name="enrollment" placeholder="Enrollment No" className="input" />
                        <ErrorMessage name="enrollment" component="div" className="error" />
                      </div>
                      <div>
                        <Field name="contact" placeholder="Contact" className="input" />
                        <ErrorMessage name="contact" component="div" className="error" />
                      </div>
                      <div>
                        <Field as="select" name="branch" className="input bg-white">
                          <option value="">Select Branch</option>
                          <option value="CSE">CSE</option>
                          <option value="IT">IT</option>
                          <option value="ECE">ECE</option>
                          <option value="ME">Mechanical (ME)</option>
                        </Field>
                        <ErrorMessage name="branch" component="div" className="error" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Field name="email" type="email" placeholder="Email" className="input" />
                      <ErrorMessage name="email" component="div" className="error" />
                    </div>
                    <div>
                      <Field type="password" name="password" placeholder="Password" className="input" />
                      <ErrorMessage name="password" component="div" className="error" />
                    </div>
                    {view === "signup" && (
                      <div>
                        <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="input" />
                        <ErrorMessage name="confirmPassword" component="div" className="error" />
                      </div>
                    )}
                  </div>

                  {view === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setView("forgot")}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg shadow-blue-100"
                  >
                    {isSubmitting ? "Processing..." : view === "signup" ? "Create Account" : "Sign In"}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 14px;
          border: 1.5px solid #f1f5f9;
          background-color: #f8fafc;
          border-radius: 16px;
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #3b82f6;
          background-color: #fff;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .error {
          color: #ef4444;
          font-size: 11px;
          margin-top: 4px;
          margin-left: 6px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;