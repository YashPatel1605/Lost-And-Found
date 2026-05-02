import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllItems } from "../authApi/authApi";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import LoginModal from "../../Modal/LoginModal";
import ItemDetails from "../../Modal/ItemDetails";

const statusColor = {
  FOUND: "bg-green-100 text-green-600",
  LOST: "bg-red-100 text-red-600",
  CLAIM: "bg-yellow-100 text-yellow-700",
};

export default function BrowserAllItem({ searchQuery = "" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All Items");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async (currentStatus, isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) setLoading(true);
      const params = {};
      const normalized = currentStatus.toLowerCase();
      if (normalized === "found" || normalized === "lost") {
        params.type = normalized;
      } else if (normalized === "claim") {
        params.type = "claim";
      }
      const res = await getAllItems(params);
      const fetchedData =
        res.data?.data?.items || res.data?.items || res.data?.data || [];
      setItems(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      if (!isBackgroundRefresh) toast.error("Could not load items");
    } finally {
      if (!isBackgroundRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(statusFilter);
  }, [statusFilter]);

  const getDisplayStatus = (item) => {
    if (
      item.status === "CLAIMED" ||
      item.itemStatus === "CLAIMED" ||
      item.type === "claim"
    )
      return "CLAIM";
    return (item.type || item.status || "POSTED").toUpperCase();
  };

  const filteredData = items.filter((item) => {
    // 1. Search Filter
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      [
        item.itemTitle,
        item.itemName,
        item.title,
        item.description,
        item.location,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    if (!matchesSearch) return false;

    // 2. Date Filter Logic
    if (dateFilter === "All Dates") return true;

    const dateStr = item.createdAt || item.date;
    if (!dateStr) return false;

    const itemDate = new Date(dateStr);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    if (dateFilter === "Today") {
      return itemDate.toDateString() === now.toDateString();
    }

    if (dateFilter === "This Week") {
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - 7);
      return itemDate >= startOfWeek;
    }

    if (dateFilter === "This Month") {
      return (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  const handleCardClick = (item) => {
    const token = localStorage.getItem("token");
    if (token) setSelectedItem(item);
    else {
      setPendingItem(item);
      toast.info("Please login to view full details");
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
        <div className={`transition-all ${selectedItem ? "blur-sm" : ""}`}>
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-gray-500 text-sm font-medium">Status:</span>
              <div className="flex gap-2">
                {["All Items", "Found", "Lost", "Claim"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      statusFilter === status
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Updated Dropdown*/}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none cursor-pointer"
            >
              <option value="All Dates">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => {
                const displayStatus = getDisplayStatus(item);
                return (
                  <div
                    key={item._id}
                    onClick={() => handleCardClick(item)}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
                  >
                    <div className="bg-blue-50 h-40 flex items-center justify-center relative">
                      <span
                        className={`absolute top-3 left-3 z-10 text-[10px] px-3 py-1 rounded-full font-bold ${statusColor[displayStatus] || "bg-gray-200"}`}
                      >
                        {displayStatus}
                      </span>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="item"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="text-5xl">📦</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800 truncate">
                        {item.itemTitle ||
                          item.itemName ||
                          item.title ||
                          "Unknown Item"}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                        {item.description}
                      </p>
                      <div className="text-xs text-gray-400 mt-4 flex flex-col gap-1">
                        <span>📍 {item.location}</span>
                        <span>
                          📅{" "}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed text-gray-400">
                No active items found for the selected filters.
              </div>
            )}
          </div>
        </div>

        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            ></div>
            <div className="relative z-50 w-full max-w-2xl">
              <ItemDetails
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                refreshItems={() => fetchItems(statusFilter, true)}
              />
            </div>
          </div>
        )}
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          if (pendingItem) setSelectedItem(pendingItem);
          setIsLoginModalOpen(false);
        }}
      />
    </>
  );
}
