export default function SimpleEffective() {
  return (
    <section className="bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full">
          How It Works
        </span>

        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Simple. Fast. Effective.
        </h2>

        <p className="mb-12 text-lg text-slate-600">
          Reuniting students with their belongings in 4 easy steps.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm transition-transform hover:scale-105">
            <div className="flex items-center justify-center w-12 h-12 mb-6 text-xl font-black text-white bg-blue-500 rounded-xl shadow-lg shadow-blue-200">
              1
            </div>
            <div className="mb-4 text-4xl">📄</div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 leading-tight">
              Report the Item
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Submit details about a lost or found item with photos, description,
              and location.
            </p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm transition-transform hover:scale-105">
            <div className="flex items-center justify-center w-12 h-12 mb-6 text-xl font-black text-white bg-blue-500 rounded-xl shadow-lg shadow-blue-200">
              2
            </div>
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 leading-tight">
              Search & Match
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Browse the listings and use filters to quickly find what you're
              looking for.
            </p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm transition-transform hover:scale-105">
            <div className="flex items-center justify-center w-12 h-12 mb-6 text-xl font-black text-white bg-blue-500 rounded-xl shadow-lg shadow-blue-200">
              3
            </div>
            <div className="mb-4 text-4xl">🤝</div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 leading-tight">
              Connect & Recover
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Contact the poster directly via call or email and arrange the
              handover on campus.
            </p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm transition-transform hover:scale-105">
            <div className="flex items-center justify-center w-12 h-12 mb-6 text-xl font-black text-white bg-blue-500 rounded-xl shadow-lg shadow-blue-200">
              4
            </div>
            <div className="mb-4 text-4xl">✅</div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 leading-tight">
              Mark as Claimed
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Once recovered, mark the item as claimed to let others know it's
              been found.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}