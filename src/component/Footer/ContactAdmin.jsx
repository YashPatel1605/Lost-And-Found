import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Claim Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Message sent to Admin! We will get back to you soon. ✅");

      setFormData({
        name: "",
        email: "",
        subject: "Claim Inquiry",
        message: "",
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact <span className="text-teal-700">Admin</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-7">
            Need help with a disputed claim or have questions about a lost item?
            Our admin team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition bg-white"
                >
                  <option>Claim Inquiry</option>
                  <option>Report Misuse</option>
                  <option>Account Issues</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-teal-700 hover:bg-teal-800"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={18} />
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-teal-700 rounded-3xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Main Office</p>
                    <p className="text-sm text-teal-100">
                      Campus Security Wing, Block B, Floor 1
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-teal-100">+1 (555) 000-1234</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-teal-100">
                      admin.lostfound@univ.edu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-teal-700 mb-4">
                <MessageSquare size={20} />
                <h4 className="font-bold">Quick Note</h4>
              </div>
              <p className="text-sm text-slate-600 leading-7">
                For faster claim resolution, include the <strong>Item ID</strong>{" "}
                or the date the item was reported. Our team typically responds
                within 24 business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}