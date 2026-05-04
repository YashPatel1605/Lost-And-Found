import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const abortControllerRef = useRef(null);

  const fetchItems = useCallback(async (currentStatus, page = 1, isBackground = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (!isBackground) setLoading(true);

      const params = {
        page: page,
        limit: 10
      };

      const normalized = currentStatus.toLowerCase();
      if (["found", "lost", "claim"].includes(normalized)) {
        params.type = normalized;
      }

      const res = await getAllItems(params, controller.signal);

      const fetchedData = res.data?.data?.items || res.data?.items || [];
      const paginationInfo = res.data?.data?.pagination || res.data?.pagination;

      setItems(Array.isArray(fetchedData) ? fetchedData : []);
      
      if (paginationInfo) {
        setTotalPages(paginationInfo.totalPages || 1);
      }
    } catch (error) {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        console.error("Fetch failed:", error);
        if (!isBackground) toast.error("Could not load items");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchItems(statusFilter, 1);
  }, [statusFilter, fetchItems]);

  useEffect(() => {
    fetchItems(statusFilter, currentPage);
  }, [currentPage, statusFilter, fetchItems]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDisplayStatus = (item) => {
    if (
      item?.type?.toLowerCase() === "claim" || 
      item?.status === "CLAIMED" || 
      item?.itemStatus === "CLAIMED"
    ) {
      return "CLAIM";
    }
    return (item?.type || item?.status || "POSTED").toUpperCase();
  };

  // --- FIXED: Use useMemo to properly react to searchQuery changes ---
  const filteredData = useMemo(() => {
    const normalizedSearch = (searchQuery || "").trim().toLowerCase();
    
    return items.filter((item) => {
      // Search filter
      if (normalizedSearch) {
        const searchFields = [
          item.itemTitle,
          item.itemName,
          item.title,
          item.name,
          item.description,
          item.location,
          item.type
        ];
        const matchesSearch = searchFields.some((field) => 
          field !== null && 
          field !== undefined && 
          String(field).toLowerCase().includes(normalizedSearch)
        );
        if (!matchesSearch) return false;
      }
      
      // Date filter
      if (dateFilter === "All Dates") return true;

      const dateStr = item.createdAt || item.date;
      if (!dateStr) return false;
      const itemDate = new Date(dateStr);
      const now = new Date();
      
      if (dateFilter === "Today") return itemDate.toDateString() === now.toDateString();
      if (dateFilter === "This Week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return itemDate >= weekAgo;
      }
      if (dateFilter === "This Month") {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [items, searchQuery, dateFilter]);

  const handleCardClick = (item) => {
    const token = localStorage.getItem("token");
    if (token) setSelectedItem(item);
    else {
      setPendingItem(item);
      toast.info("Please login to view full details");
      setIsLoginModalOpen(true);
    }
  };

  const handleItemRefresh = async (updatedItem = null) => {
    if (updatedItem?._id) {
      setItems((prev) => prev.map((it) => (it._id === updatedItem._id ? updatedItem : it)));
    } else {
      fetchItems(statusFilter, currentPage, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
      <div className={`transition-all duration-300 ${selectedItem ? "blur-md" : ""}`}>
        
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-gray-500 text-sm font-bold shrink-0">Status:</span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {["All Items", "Found", "Lost", "Claim"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    statusFilter === status ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="All Dates">All Dates</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        {/* Items Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item._id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer group flex flex-col h-full"
              >
                <div className="bg-gray-50 h-44 flex items-center justify-center relative overflow-hidden">
                  <span className={`absolute top-4 left-4 z-10 text-[10px] px-3 py-1.5 rounded-lg font-black tracking-wider shadow-sm ${statusColor[getDisplayStatus(item)] || "bg-gray-200"}`}>
                    {getDisplayStatus(item)}
                  </span>
                  {item.image ? (
                    <img src={item.image} alt="item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-5xl opacity-20">📦</div>
                  )}
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="font-extrabold text-lg text-gray-800 truncate">
                    {item.itemTitle || item.itemName || item.title || "Unknown Item"}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed">{item.description}</p>
                  <div className="mt-auto pt-4 flex flex-col gap-2">
                    <div className="flex items-center text-xs font-bold text-gray-400 gap-2">📍 {item.location}</div>
                    <div className="flex items-center text-xs font-bold text-gray-400 gap-2">📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently"}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
              No items found.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 shadow-sm hover:bg-blue-50"
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    currentPage === index + 1 ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 shadow-sm hover:bg-blue-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
          <div className="relative z-50 w-full max-w-2xl">
            <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} refreshItems={handleItemRefresh} />
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          if (pendingItem) { setSelectedItem(pendingItem); setPendingItem(null); }
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}