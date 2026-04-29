import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { submitClaim, markItemAsClaimed } from "../component/authApi/authApi";

export default function ItemDetails({ item, onClose, refreshItems }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  
  const isOwner = 
    user?.email === item?.email ||            
    user?.id === item?.reportedBy?._id ||     
    user?.id === item?.claimedBy?._id ||       
    user?.email === item?.claimedBy?.email;

  const [isClaimed, setIsClaimed] = useState(
    item?.status === "CLAIMED" || item?.itemStatus === "CLAIMED",
  );
  const [isUpdating, setIsUpdating] = useState(false);
 
  useEffect(() => {
    setIsClaimed(item?.status === "CLAIMED" || item?.itemStatus === "CLAIMED");
  }, [item?.status, item?.itemStatus]);

  if (!item) return null;

  // CLAIM SUBMIT
  const handleSubmitClaim = async () => {
    try {
      setIsSubmitting(true);
      await submitClaim(item._id);     
     
      setIsClaimed(true);
      toast.success("Claim request submitted successfully! 🎉");

      if (refreshItems) {
        refreshItems();
      }

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to submit claim ❌";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TOGGLE CLAIMED - WITH API CALL
  const handleToggleClaimed = async () => {
    try {
      setIsUpdating(true);
      await markItemAsClaimed(item._id);
      
      // ✅ INSTANTLY update UI
      setIsClaimed(!isClaimed);
      toast.success(
        !isClaimed ? "Item marked as claimed ✅" : "Claim removed ❌",
      );

      // ✅ Background refresh (no 'await')
      if (refreshItems) {
        refreshItems();
      }
    } catch (error) {
      console.error("Toggle claimed error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to update status ❌";
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  // STATUS HELPERS
  const getDisplayStatus = (item) => {
    return (
      item.itemStatus ||
      item.type ||
      item.status ||
      "POSTED"
    ).toUpperCase();
  };

  const getStatusColor = (status) => {
    if (status === "FOUND") return "bg-green-100 text-green-600";
    if (status === "LOST") return "bg-red-100 text-red-600";
    if (status === "CLAIMED" || status === "CLAIM")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const currentStatus = isClaimed ? "CLAIMED" : getDisplayStatus(item);

  return (
    <div className="w-full max-w-100 rounded-xl overflow-hidden shadow-xl relative bg-white animate-[fadeIn_.25s_ease]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center z-20 hover:bg-gray-50 transition text-xs"
      >
        ✕
      </button>

      {/* Image Section */}
      <div className="bg-blue-50 h-36 flex items-center justify-center relative">
        <span
          className={`absolute top-3 left-3 z-10 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
            currentStatus,
          )}`}
        >
          {currentStatus}
        </span>

        {item.image ? (
          <img
            src={item.image}
            alt="item"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-6xl">📦</div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold leading-tight text-gray-800">
          {item.title || item.itemName || item.itemTitle || "Untitled Item"}
        </h2>

        {/* Location & Date */}
        <div className="flex flex-wrap gap-2 mt-2 mb-3 text-xs">
          <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600">
            📍 {item.location || "N/A"}
          </span>
          <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600">
            📅{" "}
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        {/* Description */}
        <div className="border-l-4 border-blue-200 pl-3 py-0.5 mb-4">
          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
            Description
          </h4>
          <p className="text-gray-600 text-xs leading-relaxed">
            {item.description || "No description provided."}
          </p>
        </div>

        {/* Contact & Submit Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col gap-3">
            {/* USER INFO */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-inner text-sm">
                  {(item.name || item.postedBy?.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs">
                    {item.name || item.postedBy?.name || "User"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {item.email || item.postedBy?.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${item.contactNumber || ""}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  📞 Call
                </a>
                <a
                  href={`mailto:${item.email || ""}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  ✉️ Email
                </a>
              </div>
            </div>

            {/* ✅ CLAIMED USER DATA SECTION */}
            {isClaimed && item?.claimedBy && (
              <div className="flex flex-col gap-2 border-t border-green-200 pt-3 bg-green-50/50 -mx-3 px-3 rounded-b-lg">
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  ✅ Claim Requested By
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-inner text-sm">
                      {(item.claimedBy?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">
                        {item.claimedBy?.name || "You"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.claimedBy?.email || ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                    Claimed ✓
                  </div>
                </div>
              </div>
            )}

            {/* CLAIMED USER + TOGGLE - Only for Owner */}
            {item?.reportedBy && isOwner && (
              <div className="flex flex-col gap-2 border-t border-blue-100 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-inner text-sm">
                      {(item.name || item.postedBy?.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">
                        {item.reportedBy?.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.reportedBy?.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-green-600">
                    📞 {item.reportedBy?.contactNumber || "No Number"}
                  </div>
                </div>

                {item.find ? (
                  <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-green-700">
                      CLAIMED
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg border border-blue-100 mt-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Mark as Claimed
                    </span>
                    <button
                      onClick={handleToggleClaimed}
                      disabled={isUpdating}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                        isClaimed ? "bg-green-500" : "bg-gray-300"
                      } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          isClaimed ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUBMIT CLAIM - Hide if already claimed */}
            {!isOwner && !isClaimed && (
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  I confirm this item belongs to me
                </label>
                <button
                  onClick={handleSubmitClaim}
                  disabled={isSubmitting || !isChecked}
                  className={`w-full py-2 rounded-lg font-bold text-xs transition ${
                    isSubmitting || !isChecked
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-900 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Submit Claim"}
                </button>
              </div>
            )}

            {/* ALREADY CLAIMED MESSAGE */}
            {!isOwner && isClaimed && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-bold text-green-700 text-center">
                  ✅ You have successfully claimed this item
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}