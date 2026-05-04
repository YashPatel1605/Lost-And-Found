import React from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  Users,
  FileText,
  Globe,
  ChevronRight,
} from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    { id: "collection", title: "Data Collection", icon: <Eye size={18} /> },
    { id: "usage", title: "How We Use Data", icon: <FileText size={18} /> },
    { id: "sharing", title: "Data Sharing", icon: <Users size={18} /> },
    { id: "security", title: "Security Measures", icon: <Lock size={18} /> },
    { id: "cookies", title: "Cookies Policy", icon: <Globe size={18} /> },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              <ShieldCheck size={16} />
              Privacy & Trust
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950">
              Privacy Policy
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-8 text-slate-600 max-w-2xl">
              Last updated: April 30, 2026. We value your trust and explain how
              your information is collected, used, and protected in the lost-and-found platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                Campus lost & found
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                Student data protected
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                Transparent policies
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-12">
          <aside className="lg:sticky lg:top-8 h-fit">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">
                Contents
              </p>

              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-slate-400">{section.icon}</span>
                      <span className="text-sm font-medium">{section.title}</span>
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-900 text-white p-6 shadow-lg">
              <p className="text-sm font-semibold text-teal-300 uppercase tracking-[0.16em]">
                Privacy note
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                We only use your data to support item recovery, platform safety,
                and account communication.
              </p>
            </div>
          </aside>

          <section className="space-y-6">
            <article id="collection" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">1. Data We Collect</h2>
              <p className="mt-4 leading-7 text-slate-600">
                To provide our lost-and-found services, we collect information you voluntarily submit when you register, post reports, or contact support.
              </p>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-teal-600" />Account details such as name, email, and student ID.</li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-teal-600" />Report details such as item descriptions, photos, and location data.</li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-teal-600" />Messages sent to admins or other verified users.</li>
              </ul>
            </article>

            <article id="usage" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">2. How We Use Your Information</h2>
              <p className="mt-4 leading-7 text-slate-600">
                We use collected information to help match lost items with owners, improve communication, and support platform operations.
              </p>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-teal-700">Item Matching</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Helps connect found items with owners using descriptions, dates, and locations.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-teal-700">Notifications</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Sends alerts when relevant reports or claims match your submitted item.
                  </p>
                </div>
              </div>
            </article>

            <article id="sharing" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">3. Data Sharing</h2>
              <p className="mt-4 leading-7 text-slate-600">
                We do not sell your personal data. Contact details are only shared when a claim is verified or when you explicitly choose to make information public in a report.
              </p>
            </article>

            <article id="security" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">4. Security Measures</h2>
              <p className="mt-4 leading-7 text-slate-600">
                We use security controls to protect personal information in transit and at rest. Sensitive information is handled using secure transmission and database protection practices.
              </p>
            </article>

            <article id="cookies" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">5. Cookies Policy</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Cookies help us remember preferences and improve the experience. You can disable cookies in your browser, but some features may not work as expected.
              </p>
            </article>

            <footer className="rounded-3xl bg-teal-700 p-6 sm:p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold">Questions about privacy?</h3>
              <p className="mt-3 max-w-2xl leading-7 text-teal-50">
                If you have questions about this policy, contact us through the Contact page for support.
              </p>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}