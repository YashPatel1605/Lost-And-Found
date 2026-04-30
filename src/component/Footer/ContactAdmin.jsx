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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      toast.success("Message sent to Admin! We will get back to you soon. ✅");
      setFormData({ name: "", email: "", subject: "Claim Inquiry", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Contact <span className="text-blue-600">Admin</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Need help with a disputed claim or have questions about a lost item? 
            Our administration team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                >
                  <option>Claim Inquiry</option>
                  <option>Report Misuse</option>
                  <option>Account Issues</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition shadow-lg ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"} <Send size={18} />
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/50 p-2 rounded-lg"><MapPin size={20} /></div>
                  <div>
                    <p className="font-semibold">Main Office</p>
                    <p className="text-blue-100 text-sm">Campus Security Wing, Block B, Floor 1</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/50 p-2 rounded-lg"><Phone size={20} /></div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-blue-100 text-sm">+1 (555) 000-1234</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/50 p-2 rounded-lg"><Mail size={20} /></div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-blue-100 text-sm">admin.lostfound@univ.edu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <MessageSquare size={20} />
                <h4 className="font-bold">Quick Note</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                For faster resolution regarding a claim, please include the 
                <strong> Item ID </strong> or the date the item was reported. 
                Our team typically responds within 24 business hours.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}