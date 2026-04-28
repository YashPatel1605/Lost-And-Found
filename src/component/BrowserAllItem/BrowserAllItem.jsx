import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getAllItems } from "../authApi/authApi";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import LoginModal from "../../Modal/LoginModal";
import ItemDetails from "../../Modal/ItemDetails";

const statusColor = {
  FOUND: "bg-green-100 text-green-600",
  LOST: "bg-red-100 text-red-600",
  CLAIM: "bg-yellow-100 text-yellow-700",
  CLAIMED: "bg-yellow-100 text-yellow-700",
};

export default function BrowserAllItem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All Items");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("All Dates");

  const [categoryOptions, setCategoryOptions] = useState(["All Categories"]);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const discoveredFields = useRef({ status: null, category: null, date: null });

  // Reset category if selected one gets removed
  useEffect(() => {
    if (
      categoryOptions.length > 1 &&
      !categoryOptions.includes(categoryFilter)
    ) {
      setCategoryFilter("All Categories");
    }
  }, [categoryOptions]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getAllItems();
      const fetchedData =
        res.data?.data?.items ||
        res.data?.items ||
        res.data?.data ||
        res.data ||
        [];

      const finalData = Array.isArray(fetchedData) ? fetchedData : [];

      if (finalData.length > 0) {
        discoverFields(finalData);
      }

      setItems(finalData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not load items ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FOOLPROOF AUTO-DISCOVER
  // ==========================================
  const discoverFields = (data) => {
    const statusWords = [
      "lost",
      "found",
      "claimed",
      "claim",
      "posted",
      "pending",
      "active",
      "inactive",
      "resolved",
      "rejected",
    ];

    // STEP 1: Find STATUS field (check all items)
    let statusField = null;
    for (const item of data) {
      for (const key of Object.keys(item)) {
        const val = String(item[key] || "")
          .toLowerCase()
          .trim();
        if (statusWords.includes(val)) {
          statusField = key;
          break;
        }
      }
      if (statusField) break;
    }

    // STEP 2: Find CATEGORY field (check all items, skip status field)
    const categoryWords = [
      "electronic",
      "electronics",
      "wallet",
      "wallets",
      "card",
      "cards",
      "id card",
      "id cards",
      "idcard",
      "bag",
      "bags",
      "other",
      "document",
      "documents",
      "key",
      "keys",
      "phone",
      "mobile",
      "laptop",
      "book",
      "books",
      "clothing",
      "accessory",
      "watch",
      "bottle",
      "umbrella",
      "jewelry",
      "vehicle",
    ];

    let catField = null;

    for (const key of Object.keys(data[0])) {
      if (key === statusField || key === "_id") continue;

      // Collect all values for this key across ALL items
      const values = data
        .map((i) =>
          String(i[key] || "")
            .toLowerCase()
            .trim(),
        )
        .filter(Boolean);

      if (values.length === 0) continue;

      // If majority of values look like status → skip this field
      const statusCount = values.filter((v) => statusWords.includes(v)).length;
      if (statusCount > values.length / 2) continue;

      // If ANY value matches a known category word → this is the category field
      const hasCatMatch = values.some((v) =>
        categoryWords.some((c) => {
          if (c.length <= 4 && v.length <= 4) return c === v;
          return v.includes(c) || c.includes(v);
        }),
      );

      if (hasCatMatch) {
        catField = key;
        break;
      }
    }

    if (catField) {
      discoveredFields.current.category = catField;
      const uniqueCats = [
        ...new Set(
          data
            .map((i) => {
              const v = String(i[catField] || "").trim();
              return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
            })
            .filter(Boolean),
        ),
      ];
      setCategoryOptions(["All Categories", ...uniqueCats]);
    } else {
      // ULTIMATE FALLBACK: extract every short string from every field
      const fallbackCats = new Set();
      for (const item of data) {
        for (const val of Object.values(item)) {
          const s = String(val || "").trim();
          if (!s || s.length > 40 || s.length < 2) continue;
          if (statusWords.includes(s.toLowerCase())) continue;
          if (/^[0-9a-f]{24}$/i.test(s)) continue; // MongoDB ID
          if (/^\d{4}-\d{2}-\d{2}/.test(s)) continue; // Date string
          if (/^https?:\/\//.test(s)) continue; // Image URL
          fallbackCats.add(
            s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
          );
        }
      }
      const opts = Array.from(fallbackCats);
      if (opts.length > 0 && opts.length < 30) {
        setCategoryOptions(["All Categories", ...opts]);
      }
    }

    // STEP 3: Find DATE field
    for (const item of data) {
      for (const key of Object.keys(item)) {
        if (key === "_id" || key.toLowerCase().includes("updated")) continue;
        const val = item[key];
        if (
          val &&
          typeof val === "string" &&
          /^\d{4}-\d{2}-\d{2}/.test(val) &&
          !isNaN(new Date(val).getTime())
        ) {
          discoveredFields.current.date = key;
          break;
        }
      }
      if (discoveredFields.current.date) break;
    }

    discoveredFields.current.status = statusField;
    console.log("🎯 Discovered:", discoveredFields.current);
  };

  // ==========================================
  // DATE HELPERS
  // ==========================================
  const isToday = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const isThisWeek = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    } catch {
      return false;
    }
  };

  const isThisMonth = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    } catch {
      return false;
    }
  };

  // ==========================================
  // FILTER LOGIC
  // ==========================================
  const filteredData = items.filter((item) => {
    // ---- STATUS ----
    let matchesStatus = statusFilter === "All Items";
    if (!matchesStatus) {
      let rawStatus = "";
      if (discoveredFields.current.status) {
        rawStatus = String(item[discoveredFields.current.status] || "")
          .toLowerCase()
          .trim();
      } else {
        rawStatus = String(
          item.itemStatus || item.status || item.type || item.itemType || "",
        )
          .toLowerCase()
          .trim();
      }
      const fv = statusFilter.toLowerCase().trim();
      matchesStatus = rawStatus.includes(fv) || fv.includes(rawStatus);
    }

    // ---- CATEGORY ----
    let matchesCategory = categoryFilter === "All Categories";
    if (!matchesCategory) {
      const fv = categoryFilter.toLowerCase().trim();
      if (discoveredFields.current.category) {
        const raw = String(item[discoveredFields.current.category] || "")
          .toLowerCase()
          .trim();
        matchesCategory = raw === fv || raw.includes(fv) || fv.includes(raw);
      } else {
        // Fallback: scan every field
        matchesCategory = Object.entries(item).some(([k, v]) => {
          const s = String(v || "")
            .toLowerCase()
            .trim();
          if (!s || s.length > 40) return false;
          return s === fv || s.includes(fv) || fv.includes(s);
        });
      }
    }

    // ---- DATE ----
    let matchesDate = true;
    if (dateFilter !== "All Dates") {
      let dateStr = "";
      if (discoveredFields.current.date) {
        dateStr = item[discoveredFields.current.date] || "";
      } else {
        for (const v of Object.values(item)) {
          if (
            v &&
            typeof v === "string" &&
            v.length > 10 &&
            !isNaN(new Date(v).getTime())
          ) {
            dateStr = v;
            break;
          }
        }
      }
      if (!dateStr) {
        matchesDate = false;
      } else if (dateFilter === "Today") {
        matchesDate = isToday(dateStr);
      } else if (dateFilter === "This Week") {
        matchesDate = isThisWeek(dateStr);
      } else if (dateFilter === "This Month") {
        matchesDate = isThisMonth(dateStr);
      }
    }

    return matchesStatus && matchesCategory && matchesDate;
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleCardClick = (item) => {
    const token = localStorage.getItem("token");
    if (token) {
      setSelectedItem(item);
    } else {
      setPendingItem(item);
      toast.info("Please login to view full details 🔑");
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    if (pendingItem) {
      setSelectedItem(pendingItem);
      setPendingItem(null);
      setIsLoginModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative overflow-hidden">
        <div
          className={`transition-all duration-300 ${selectedItem ? "blur-sm scale-[0.99]" : ""}`}
        >
          {/* FILTER BAR */}
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <span className="text-gray-500 text-xs sm:text-sm font-medium whitespace-nowrap">
                Filter:
              </span>
              <div className="flex items-center gap-2">
                {["All Items", "Found", "Lost", "Claimed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all font-medium whitespace-nowrap ${
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

            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm outline-none cursor-pointer"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm outline-none cursor-pointer"
              >
                <option>All Dates</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>

          {/* ITEMS GRID */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => {
                const displayStatus = (
                  item.itemStatus ||
                  item.status ||
                  item.type ||
                  item.itemType ||
                  "POSTED"
                ).toUpperCase();

                return (
                  <div
                    key={item._id}
                    onClick={() => handleCardClick(item)}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
                  >
                    <div className="bg-blue-50 h-40 flex items-center justify-center relative overflow-hidden">
                      <span
                        className={`absolute top-3 left-3 z-10 text-[10px] px-3 py-1 rounded-full font-bold ${statusColor[displayStatus] || "bg-gray-200 text-gray-700"}`}
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
                        {item.itemName ||
                          item.itemTitle ||
                          item.title ||
                          "Untitled Item"}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-2 h-10">
                        {item.description}
                      </p>
                      <div className="flex flex-col gap-1 text-xs text-gray-400 mt-4">
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
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed">
                <p className="text-gray-500">
                  No items found for "{statusFilter}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* MODAL */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-md"
              onClick={handleCloseModal}
            ></div>
            <div className="relative z-50 w-full flex items-center justify-center">
              <ItemDetails item={selectedItem} onClose={handleCloseModal} />
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
