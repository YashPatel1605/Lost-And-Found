import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../authApi/authApi";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const schema = Yup.object({
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await resetPassword(token, values.password);
      toast.success("Password updated successfully! ✅");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. Link may be expired.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow">
          <p className="text-red-500 font-bold">Invalid or missing reset token ❌</p>
          <button onClick={() => navigate("/login")} className="mt-4 text-blue-500 underline">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Reset Password</h2>
        <p className="text-gray-500 text-center mb-8">Set your new password below.</p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="New Password"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}