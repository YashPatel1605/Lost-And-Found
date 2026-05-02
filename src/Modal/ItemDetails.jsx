import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { submitClaim, markItemAsClaimed } from "../component/authApi/authApi";

export default function ItemDetails({ item, onClose, refreshItems }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasSubmittedClaim, setHasSubmittedClaim] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Unable to parse local user from storage:", error);
  }

  const currentUserId = String(
    user?._id || user?.id || localStorage.getItem("userId") || ""
  );
  const currentUserEmail = String(user?.email || "").toLowerCase();

  const matchesCurrentUser = (candidateId, candidateEmail) => {
    const normalizedId = String(candidateId || "");
    const normalizedEmail = String(candidateEmail || "").toLowerCase();

    return (
      (currentUserId && normalizedId && currentUserId === normalizedId) ||
      (currentUserEmail &&
        normalizedEmail &&
        currentUserEmail === normalizedEmail)
    );
  };

  const isReportUser =
    matchesCurrentUser(item?.reportedBy?._id, item?.reportedBy?.email) ||
    matchesCurrentUser(item?.reportedBy?.id, item?.reportedBy?.email) ||
    matchesCurrentUser(item?.postedBy?._id, item?.postedBy?.email) ||
    matchesCurrentUser(item?.postedBy?.id, item?.postedBy?.email) ||
    matchesCurrentUser(item?.userId, item?.email) ||
    matchesCurrentUser(item?.createdBy, item?.email) ||
    matchesCurrentUser(null, item?.email);

  const [isClaimed, setIsClaimed] = useState(
    item?.find === true ||
      item?.status === "CLAIMED" ||
      item?.itemStatus === "CLAIMED" ||
      item?.type === "claim"
  );

  useEffect(() => {
    const initialState =
      item?.find === true ||
      item?.status === "CLAIMED" ||
      item?.itemStatus === "CLAIMED" ||
      item?.type === "claim";

    setIsClaimed(initialState);
    if (initialState) setWasUpdated(true);
  }, [item?.find, item?.status, item?.itemStatus, item?.type]);

  useEffect(() => {
    setHasSubmittedClaim(false);
    setIsChecked(false);
  }, [item?._id]);

  if (!item) return null;

  const localUserCard = {
    key: "local-user",
    // label: "Current User",
    name: user?.name || user?.fullName || user?.username || "Local User",
    email: user?.email || "No email",
    contactNumber:
      user?.contactNumber || user?.phone || user?.mobile || "No Number",
    bg: "bg-blue-600",
    showActions: false,
  };

  const reportedUserCard = {
    key: "reported-user",
    label: "Reported User",
    name:
      item?.reportedBy?.name ||
      item?.postedBy?.name ||
      item?.name ||
      "Reported User",
    email:
      item?.reportedBy?.email ||
      item?.postedBy?.email ||
      item?.email ||
      "No email",
    contactNumber:
      item?.reportedBy?.contactNumber ||
      item?.postedBy?.contactNumber ||
      item?.contactNumber ||
      "No Number",
    bg: "bg-blue-600",
    showActions: true,
  };

  const displayUsers = useMemo(() => {
    return [reportedUserCard, localUserCard];
  }, [item, user]);

  const handleSubmitClaim = async () => {
    try {
      setIsSubmitting(true);
      await submitClaim(item._id);

      setHasSubmittedClaim(true);
      setIsClaimed(true);
      toast.success("Claim request submitted successfully! 🎉");

      if (refreshItems) refreshItems();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to submit claim ❌";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleClaimed = async () => {
    if (isUpdating || isClaimed) return;

    try {
      setIsUpdating(true);
      await markItemAsClaimed(item._id, true);

      setIsClaimed(true);
      setWasUpdated(true);
      toast.success("Item marked as claim ✅");

      if (refreshItems) refreshItems();
    } catch (error) {
      console.error("Toggle claimed error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to update status ❌";
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const getDisplayStatus = (item) => {
    const rawStatus = (
      item?.find === true
        ? "CLAIM"
        : item?.itemStatus || item?.status || item?.type || "POSTED"
    ).toUpperCase();

    return rawStatus === "CLAIMED" ? "CLAIM" : rawStatus;
  };

  const getStatusColor = (status) => {
    if (status === "FOUND") return "bg-green-100 text-green-600";
    if (status === "LOST") return "bg-red-100 text-red-600";
    if (status === "CLAIMED" || status === "CLAIM")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const currentStatus = isClaimed ? "CLAIM" : getDisplayStatus(item);
  const itemImage = item?.image?.url || item?.image || item?.itemImage || "";

  return (
    <div className="w-full max-w-120 rounded-[22px] overflow-hidden shadow-2xl relative bg-white animate-[fadeIn_.25s_ease]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-9 h-9 bg-white/95 shadow-md rounded-full flex items-center justify-center z-20 hover:bg-gray-50 transition text-xs text-gray-500"
      >
        ✕
      </button>

      <div className="bg-[#edf4fb] h-36 flex items-center justify-center relative">
        <span
          className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
            currentStatus
          )}`}
        >
          {currentStatus}
        </span>

        {itemImage ? (
          <img
            src={itemImage}
            alt="item"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-6xl">📦</div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-[28px] font-extrabold leading-tight text-gray-800">
          {item.title || item.itemTitle || item.itemName || "Untitled Item"}
        </h2>

        <div className="flex flex-wrap gap-2 mt-2 mb-4 text-xs">
          <span className="text-gray-500">📍 {item.location || "N/A"}</span>
          <span className="text-gray-500">
            📅{" "}
            {item.createdAt || item.dateFound
              ? new Date(item.createdAt || item.dateFound).toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        <div className="border-l-[3px] border-blue-200 pl-3 py-0.5 mb-4">
          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
            Description
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {item.description || "No description provided."}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="bg-[#eef5ff] border border-[#d9e7fb] rounded-2xl p-3 flex flex-col gap-3">
            {displayUsers.map((person) => (
              <div
                key={person.key}
                className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-2xl px-3 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full ${person.bg} text-white flex items-center justify-center font-bold shadow-inner text-sm shrink-0`}
                  >
                    {(person?.name || "U").charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {person?.name}
                    </p>
                    <p className="text-[11px] text-gray-500 break-all leading-tight">
                      {person?.email}
                    </p>

                    {!person.showActions && (
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                        {person.label}
                      </p>
                    )}
                  </div>
                </div>

                {person.showActions ? (
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`tel:${
                        person.contactNumber !== "No Number"
                          ? person.contactNumber
                          : ""
                      }`}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      📞 Call
                    </a>
                    <a
                      href={`mailto:${
                        person.email !== "No email" ? person.email : ""
                      }`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      ✉️ Email
                    </a>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-green-600 whitespace-nowrap">
                    📞 {person?.contactNumber}
                  </div>
                )}
              </div>
            ))}

            {isReportUser && (
              <div className="flex items-center justify-between bg-white/70 px-3 py-2.5 rounded-xl border border-blue-100 mt-1">
                <span className="text-xs font-medium text-gray-700">
                  {isClaimed ? "Claim Status" : "Mark as Claim"}
                </span>
                <button
                  type="button"
                  onClick={handleToggleClaimed}
                  disabled={isUpdating || wasUpdated}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                    isClaimed ? "bg-[#7cd9a3]" : "bg-gray-300"
                  } ${
                    isUpdating || wasUpdated
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isClaimed ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}

            {!isReportUser && !isClaimed && (
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

            {!isReportUser && isClaimed && hasSubmittedClaim && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-xs font-bold text-green-700 text-center">
                  ✅ You have successfully claimed this item
                </p>
              </div>
            )}

            {!isReportUser && isClaimed && !hasSubmittedClaim && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-xs font-bold text-yellow-700 text-center">
                  This item has already been claimed
                </p>
              </div>
            )}

            {isReportUser && isClaimed && (
              <div className="bg-green-50 border border-green-200 py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2">
                <span className="text-green-600 text-sm">✅</span>
                <span className="text-[11px] font-bold text-green-700 uppercase tracking-tight">
                  MARKED AS CLAIMED SUCCESSFULLY
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}