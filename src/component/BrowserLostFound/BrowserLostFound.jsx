export default function BrowserLostFound() {
  return (
    <section className="w-full bg-linear-to-r from-[#0b1d3a] via-[#0f2a4d] to-[#0b1d3a] py-16 px-4">
      
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Browse Lost & Found Items
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-gray-300 text-sm sm:text-base md:text-lg">
          Explore all reported items from your campus community
        </p>

        {/* Search Box */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          
          <input
            type="text"
            placeholder="Search by title, description, location..."
            className="w-full flex-1 px-4 py-3 rounded-xl bg-[#1e2f4d] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold rounded-xl">
            Search
          </button>

        </div>
      </div>
    </section>
  );
}