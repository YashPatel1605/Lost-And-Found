import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { submitClaim, markItemAsClaimed } from "../component/authApi/authApi";

export default function ItemDetails({ item, onClose, refreshItems }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasSubmittedClaim, setHasSubmittedClaim] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);

  if (!item) return null;

  //  Current user
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

  //  Owner / reporter check 
  const isReportUser =
    matchesCurrentUser(item?.reportedBy?._id, item?.reportedBy?.email) ||
    matchesCurrentUser(item?.reportedBy?.id, item?.reportedBy?.email) ||
    matchesCurrentUser(item?.postedBy?._id, item?.postedBy?.email) ||
    matchesCurrentUser(item?.postedBy?.id, item?.postedBy?.email) ||
    matchesCurrentUser(item?.userId, item?.email) ||
    matchesCurrentUser(item?.createdBy, item?.email) ||
    matchesCurrentUser(null, item?.email);

  const canChangeStatus = isReportUser;

  // Claimed state (Found ≠ Claimed) 
  const getInitialClaimState = (it) => {
    const status =
      it?.itemStatus ||
      it?.status ||
      it?.type ||
      "";

    const normalized = String(status).toLowerCase();
    return normalized === "claimed" || normalized === "claim";
  };

  const [isClaimed, setIsClaimed] = useState(getInitialClaimState(item));

  useEffect(() => {
    const claimed = getInitialClaimState(item);
    setIsClaimed(claimed);
    if (claimed) setWasUpdated(true);
  }, [item?.itemStatus, item?.status, item?.type]);

  useEffect(() => {
    setHasSubmittedClaim(false);
    setIsChecked(false);
  }, [item?._id]);

  //  Claimed users list 
  const claimedUsers = useMemo(() => {
    const hasAnyClaimField =
      item?.claimedBy ||
      item?.claimedUsers ||
      item?.claimUsers ||
      item?.claimRequests ||
      item?.claimRequestedBy ||
      item?.claimedByUser ||
      item?.claimer ||
      item?.claimants;

    if (!hasAnyClaimField) return [];

    const rawSources = [
      item?.claimedBy,
      item?.claimedUsers,
      item?.claimUsers,
      item?.claimRequests,
      item?.claimRequestedBy,
      item?.claimedByUser,
      item?.claimer,
      item?.claimants,
    ];

    const flattened = rawSources.flatMap((source) => {
      if (!source) return [];
      if (Array.isArray(source)) return source;
      return [source];
    });

    const normalized = flattened
      .map((u, index) => ({
        _id: String(u?._id || u?.id || `fallback-${index}`),
        id: String(u?.id || u?._id || `fallback-${index}`),
        name:
          u?.name ||
          u?.fullName ||
          u?.userName ||
          u?.username ||
          u?.requestedBy?.name ||
          u?.user?.name ||
          "",
        email:
          u?.email ||
          u?.requestedBy?.email ||
          u?.user?.email ||
          "",
        contactNumber:
          u?.contactNumber ||
          u?.phone ||
          u?.mobile ||
          u?.requestedBy?.contactNumber ||
          u?.user?.contactNumber ||
          "",
      }))
      .filter((u) => u.name || u.email || u.contactNumber);

    const uniqueUsers = normalized.filter((user, index, self) => {
      return (
        index ===
        self.findIndex(
          (u) =>
            (u._id && u._id === user._id) ||
            (u.email && u.email === user.email)
        )
      );
    });

    const withoutOwner = uniqueUsers.filter((u) => {
      const isCurrentUser = matchesCurrentUser(u._id, u.email);
      const isReportedBy =
        item?.reportedBy &&
        (String(item.reportedBy._id) === u._id ||
          item.reportedBy.email === u.email);
      const isPostedBy =
        item?.postedBy &&
        (String(item.postedBy._id) === u._id ||
          item.postedBy.email === u.email);
      const isItemEmailOwner = item?.email && item.email === u.email;

      return !(isCurrentUser || isReportedBy || isPostedBy || isItemEmailOwner);
    });

    return withoutOwner;
  }, [item, matchesCurrentUser]);

  const isClaimRequester = claimedUsers.some(
    (claimUser) =>
      matchesCurrentUser(claimUser?._id, claimUser?.email) ||
      matchesCurrentUser(claimUser?.id, claimUser?.email)
  );

  //  UI flags 
  const showClaimRequestedBySection =
    isClaimed && claimedUsers.length > 0 && canChangeStatus; 

  const showClaimRequesterMessage =
    !canChangeStatus && isClaimed && (isClaimRequester || hasSubmittedClaim);

  const showClaimedByAnotherUserMessage =
    !canChangeStatus && isClaimed && !isClaimRequester && !hasSubmittedClaim;

  const showOwnerClaimBanner = canChangeStatus && isClaimed;

  //  Actions
  const handleSubmitClaim = async () => {
    try {
      setIsSubmitting(true);
      await submitClaim(item._id);

      setHasSubmittedClaim(true);
      setIsClaimed(true);
      toast.success("Claim request submitted successfully! 🎉");

      if (refreshItems) {
        refreshItems();
      }

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to submit claim ❌";
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

      if (refreshItems) {
        refreshItems();
      }
    } catch (error) {
      console.error("Toggle claimed error:", error);
      const errorMsg =
        error?.response?.data?.message || "Failed to update status ❌";
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  //  Status badges 
  const getDisplayStatus = (it) => {
    const status =
      it?.itemStatus ||
      it?.status ||
      it?.type ||
      "POSTED";

    const rawStatus = String(status).toUpperCase();
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

  //  Render 
  return (
    <div className="w-full max-w-[400px] rounded-xl overflow-hidden shadow-xl relative bg-white animate-[fadeIn_.25s_ease]">
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center z-20 hover:bg-gray-50 transition text-xs"
      >
        ✕
      </button>

      <div className="bg-blue-50 h-36 flex items-center justify-center relative">
        <span
          className={`absolute top-3 left-3 z-10 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
            currentStatus
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

        <div className="border-l-4 border-blue-200 pl-3 py-0.5 mb-4">
          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
            Description
          </h4>
          <p className="text-gray-600 text-xs leading-relaxed">
            {item.description || "No description provided."}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col gap-3">
            {/* Owner / Contact */}
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
                  <p className="text-[11px] text-gray-500 break-all">
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

            {/* Claim requested by (only for owner) */}
            {showClaimRequestedBySection && claimedUsers.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-green-200 pt-3 bg-green-50/50 -mx-3 px-3 rounded-b-lg">
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  ✅ Claim Requested By ({claimedUsers.length})
                </p>

                {claimedUsers.map((claimUser, index) => (
                  <div
                    key={`${claimUser?._id || claimUser?.id || claimUser?.email || "user"}-${index}`}
                    className="flex items-center justify-between gap-3 bg-white/80 border border-green-100 rounded-lg px-2 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-inner text-sm">
                        {(claimUser?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">
                          {claimUser?.name || "User"}
                        </p>
                        <p className="text-[11px] text-gray-500 break-all">
                          {claimUser?.email || "No email"}
                        </p>
                        {claimUser?.contactNumber && (
                          <p className="text-[11px] text-gray-500">
                            📞 {claimUser.contactNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg whitespace-nowrap">
                      Claimed ✓
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Owner controls */}
            {canChangeStatus && (
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
                        {item.reportedBy?.name ||
                          item.postedBy?.name ||
                          item.name ||
                          "User"}
                      </p>
                      <p className="text-[11px] text-gray-500 break-all">
                        {item.reportedBy?.email ||
                          item.postedBy?.email ||
                          item.email ||
                          "No email"}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-green-600">
                    📞{" "}
                    {item.reportedBy?.contactNumber ||
                      item.contactNumber ||
                      "No Number"}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg border border-blue-100 mt-2">
                  <span className="text-xs font-semibold text-gray-700">
                    {isClaimed ? "Claim Status" : "Mark as Claim"}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleClaimed}
                    disabled={isUpdating || wasUpdated}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                      isClaimed ? "bg-green-500" : "bg-gray-300"
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
              </div>
            )}

            {/* Claim form for normal users */}
            {!canChangeStatus && !isClaimed && (
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

            {/* Messages */}
            {showClaimRequesterMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-bold text-green-700 text-center">
                  ✅ You have successfully claimed this item
                </p>
              </div>
            )}

            {showClaimedByAnotherUserMessage && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs font-bold text-yellow-700 text-center">
                  This item has already been claimed
                </p>
              </div>
            )}

            {showOwnerClaimBanner && (
              <div className="bg-green-50 border border-green-200 py-2 px-4 rounded-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                <span className="text-green-600 text-sm">✅</span>
                <span className="text-[12px] font-bold text-green-700 uppercase tracking-tight">
                  Marked as Claimed Successfully
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}