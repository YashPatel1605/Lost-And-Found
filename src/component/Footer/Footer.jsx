import React from "react";

export default function Footer() {
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

          {/* Quick Links + Categories (Same Row) */}
          <div className="grid grid-cols-2 gap-8">
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer">Home</li>
                <li className="hover:text-white cursor-pointer">Browse Items</li>
                <li className="hover:text-white cursor-pointer">Report Item</li>
                <li className="hover:text-white cursor-pointer">Dashboard</li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white cursor-pointer">Electronics</li>
                <li className="hover:text-white cursor-pointer">ID Cards</li>
                <li className="hover:text-white cursor-pointer">Bags & Wallets</li>
                <li className="hover:text-white cursor-pointer">Books</li>
                <li className="hover:text-white cursor-pointer">Keys</li>
              </ul>
            </div>

          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Contact Admin</li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Use</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-3 text-center sm:text-left">

          <p>© 2025 CampusFind. All rights reserved.</p>

          <p>
            Made with <span className="text-red-500">❤️</span> for campus students
          </p>

        </div>

      </div>
    </footer>
  );
}