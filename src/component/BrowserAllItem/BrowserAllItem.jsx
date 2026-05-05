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
      if (!isBackground) setLoading(false);
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

  const filteredData = useMemo(() => {
    const normalizedSearch = (searchQuery || "").trim().toLowerCase();
    
    return items.filter((item) => {
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
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm font-bold shrink-0">Status:</span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {["All Items", "Found", "Lost", "Claim"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 ${
                    statusFilter === status 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-52 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer appearance-none"
            >
              <option value="All Dates">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item._id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full border border-transparent hover:border-blue-100"
              >
                {/* Fixed Image Wrapper */}
                <div className="bg-gray-50 h-52 flex items-center justify-center relative overflow-hidden p-2">
                  <span className={`absolute top-4 left-4 z-10 text-[10px] px-3 py-1.5 rounded-lg font-black tracking-wider shadow-sm ${statusColor[getDisplayStatus(item)] || "bg-gray-200"}`}>
                    {getDisplayStatus(item)}
                  </span>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt="item" 
                      // Changed from object-cover to object-contain to show full image
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="text-5xl opacity-20">📦</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow">
                  <h3 className="font-extrabold text-lg text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                    {item.itemTitle || item.itemName || item.title || "Unknown Item"}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed grow">
                    {item.description}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-50 flex flex-col gap-2">
                    <div className="flex items-center text-xs font-bold text-gray-400 gap-2">
                      <span className="text-blue-500">📍</span> {item.location}
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-400 gap-2">
                      <span className="text-blue-500">📅</span> {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
              <div className="text-6xl mb-4">🔍</div>
              No items found matching your filters.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="mt-16 flex justify-center items-center gap-2 md:gap-4 pb-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 shadow-sm hover:bg-blue-50"
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-1 md:gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      currentPage === pageNum ? "bg-blue-600 text-white shadow-md scale-110" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedItem(null)}></div>
          <div className="relative z-50 w-full max-w-2xl animate-in fade-in zoom-in duration-300">
            <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} refreshItems={handleItemRefresh} />
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          if (pendingItem) { 
            setSelectedItem(pendingItem); 
            setPendingItem(null); 
          }
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}