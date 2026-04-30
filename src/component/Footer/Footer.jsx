import React from "react";
import { Link } from "react-router-dom"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const userRole = localStorage.getItem("role");
  const dashboardPath = userRole === "admin" ? "/admin-dashboard" : "/dashboard";

  return (
    <footer className="bg-[#061b33] text-gray-300 px-4 sm:px-6 md:px-12 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔍 CampusFind
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              The official Lost & Found portal for your campus community.
              Helping students reconnect with their belongings since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/listings" className="hover:text-white transition-colors">Browse Items</Link>
                </li>
                <li>
                  <Link to="/report" className="hover:text-white transition-colors">Report Item</Link>
                </li>
                <li>
                  <Link to="/mypost" className="hover:text-white transition-colors">Dashboard</Link>
                </li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white">Contact Admin</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>          
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-3 text-center sm:text-left">
          <p>© {currentYear} CampusFind. All rights reserved.</p>
          <p>
            Made with <span className="text-red-500">❤️</span> for campus students
          </p>
        </div>
      </div>
    </footer>
  );
}