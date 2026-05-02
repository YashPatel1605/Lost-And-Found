import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllItems } from "../authApi/authApi";

export default function LostSomething() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalItems: 0,
    recoveredItems: 0,
    students: 0,
  });

  // FETCH STATS ON LOAD
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const itemsRes = await getAllItems();

      const items =
        itemsRes.data?.data?.items ||
        itemsRes.data?.items ||
        itemsRes.data?.data ||
        itemsRes.data ||
        [];

      // ✅ TOTAL ITEMS
      const totalItems = items.length;

      // ✅ RECOVERED ITEMS
      const recoveredItems = items.filter(
        (item) =>
          item.find === true ||
          item.status === "CLAIMED" ||
          item.itemStatus === "CLAIMED"
      ).length;

      // ✅ UNIQUE USERS (STUDENTS)
      const uniqueUsers = new Set(
        items.map(
          (item) =>
            item.userId ||
            item.createdBy ||
            item.user?._id ||   // fallback
            item.user?.id
        )
      );

      const students = uniqueUsers.size;

      setStats({
        totalItems,
        recoveredItems,
        students,
      });
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-[#0b1d3a] via-[#0f2a4d] to-[#0b1d3a] text-white flex items-center justify-center px-4">
      <div className="max-w-7xl w-full text-center">

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 border border-blue-400/30 bg-blue-500/10 px-4 py-1 rounded-full text-sm text-blue-300 mb-6">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          CAMPUS LOST & FOUND PORTAL
        </div>

        {/* Heading */}
        <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
          Lost something? Found something{" "}
          <span className="text-blue-400">We connect.</span>
        </h1>

        {/* Sub Text */}
        <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          The smartest lost & found platform for your campus. Report, search,
          and recover items with ease — all in one place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/listings")}
            className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
          >
            🔍 Browse Items
          </button>

          <button
            onClick={() => navigate("/report")}
            className="border border-gray-500 hover:border-blue-400 hover:text-blue-400 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            📦 Report an Item
          </button>
        </div>

        {/* STATS */}
        <div className="flex justify-center mt-10">
          <div className="w-full max-w-3xl bg-[#0f2747]/80 backdrop-blur-sm rounded-xl px-4 py-4">
            <div className="grid grid-cols-3 text-center items-center">

              {/* Items Listed */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 leading-none">
                  {stats.totalItems}+
                </h2>
                <p className="text-gray-400 text-[11px] sm:text-xs mt-1">
                  Items Listed
                </p>
              </div>

              {/* Items Recovered */}
              <div className="border-x border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 leading-none">
                  {stats.recoveredItems}+
                </h2>
                <p className="text-gray-400 text-[11px] sm:text-xs mt-1">
                  Items Recovered
                </p>
              </div>

              {/* Students Registered */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 leading-none">
                  {stats.students}+
                </h2>
                <p className="text-gray-400 text-[11px] sm:text-xs mt-1">
                  Students Registered
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}