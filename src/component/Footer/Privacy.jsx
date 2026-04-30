import React from "react";
import { ShieldCheck, Lock, Eye, Users, FileText, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    { id: "collection", title: "Data Collection", icon: <Eye size={20} /> },
    { id: "usage", title: "How We Use Data", icon: <FileText size={20} /> },
    { id: "sharing", title: "Data Sharing", icon: <Users size={20} /> },
    { id: "security", title: "Security Measures", icon: <Lock size={20} /> },
    { id: "cookies", title: "Cookies Policy", icon: <Globe size={20} /> },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gray-900 py-16 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4">
          <ShieldCheck className="text-blue-400 w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Last updated: April 30, 2026. We value your trust and are committed to 
          protecting your personal information.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8 space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
                Contents
              </p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group"
                >
                  <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                    {section.icon}
                  </span>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Policy Content */}
          <main className="lg:w-3/4 space-y-12 pb-24 text-gray-700 leading-relaxed">
            
            <section id="collection">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Data We Collect</h2>
              <p className="mb-4">
                To provide our Lost & Found services, we collect information that you 
                voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register an account (Name, Email, Student ID).</li>
                <li>Post a report (Item descriptions, photos, location data).</li>
                <li>Communicate with other users or admins.</li>
              </ul>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect primarily to facilitate the recovery 
                of lost items. This includes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-bold text-sm text-blue-600 mb-1">Item Matching</p>
                  <p className="text-sm">Connecting found items with potential owners based on descriptions.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-bold text-sm text-blue-600 mb-1">Notifications</p>
                  <p className="text-sm">Sending alerts when a matching item is reported in your area.</p>
                </div>
              </div>
            </section>

            <section id="sharing">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sharing of Information</h2>
              <p>
                We do **not** sell your personal data to third parties. Your contact information 
                is only revealed to other users when a claim is verified or if you choose 
                to make it public in your report.
              </p>
            </section>

            <section id="security">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of 
                your personal information. All sensitive data is transmitted via 
                Secure Socket Layer (SSL) technology and encrypted in our database.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies Policy</h2>
              <p>
                We use cookies to understand and save your preferences for future visits. 
                You can choose to turn off all cookies via your browser settings, but 
                some features of the site may not function properly.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 italic">
                If you have any questions regarding this privacy policy, you may 
                contact us using the information on our Contact page.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}