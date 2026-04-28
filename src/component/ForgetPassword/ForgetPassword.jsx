import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../authApi/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword({ onBack }) {
  const navigate = useNavigate();

  const schema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await forgotPassword(values.email);
      
      // Note: In production, the backend should send the email. 
      // If your backend returns the token for testing:
      const token = res?.data?.token || res?.data?.data?.token || res?.data?.resetToken;

      toast.success(res?.data?.message || "Reset link sent to your email! ✅");

      if (token) {
        // Redirecting to the reset page with the token as a query param
        setTimeout(() => navigate(`/reset-password?token=${token}`), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-purple-100 p-3 rounded-xl mb-4">
          <span className="text-2xl">@</span> 
        </div>
        <p className="text-gray-500 text-center px-4">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Email Address
              </label>
              <Field
                name="email"
                type="email"
                placeholder="dh849@gmail.com"
                className={`w-full p-3 border rounded-xl outline-none transition-all ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 ml-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-all shadow-lg shadow-blue-100"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center text-sm text-gray-500">
        Remember your password?{" "}
        <button onClick={onBack} className="text-blue-600 font-bold hover:underline">
          Log in
        </button>
      </div>
    </div>
  );
}