// import React, { useState, useEffect } from 'react'
// import { toast } from 'react-toastify'
// import { submitClaim, markItemAsClaimed } from '../component/authApi/authApi'

// export default function ItemDetails({ item, onClose, refreshItems }) {
// 	let localStorageId = ''
// 	try {
// 		const user = JSON.parse(localStorage.getItem('user') || 'null')

// 		localStorageId = String(user?.id || user?._id || localStorage.getItem('userId') || '')
// 	} catch {
// 		localStorageId = localStorage.getItem('userId') || ''
// 	}

// 	const itemUserId = String(item?.userId || '')
// 	const reportedById = String(item?.reportedBy?._id || item?.reportedBy?.id || '')

// 	const isItemOwner = localStorageId && itemUserId && localStorageId === itemUserId

// 	const hasReportedBy = !!item?.reportedBy && !!reportedById

// 	const isReporter = localStorageId && reportedById && localStorageId === reportedById

// 	const canToggleClaim = isItemOwner || isReporter

// 	const getInitialClaimState = () => {
// 		const status = String(item?.itemStatus || item?.status || item?.type || '').toLowerCase()
// 		return status === 'claimed' || status === 'claim'
// 	}

// 	const [isClaimed, setIsClaimed] = useState(getInitialClaimState)
// 	const [isChecked, setIsChecked] = useState(false)
// 	const [isSubmitting, setIsSubmitting] = useState(false)
// 	const [hasSubmittedClaim, setHasSubmittedClaim] = useState(false)
// 	const [isUpdating, setIsUpdating] = useState(false)

// 	useEffect(() => {
// 		setIsClaimed(getInitialClaimState())
// 		setIsChecked(false)
// 		setHasSubmittedClaim(false)
// 	}, [item?._id, item?.itemStatus, item?.status, item?.type])

// 	if (!item) return null

// 	const getDisplayStatus = () => {
// 		const status = String(item?.itemStatus || item?.status || item?.type || 'POSTED').toUpperCase()
// 		if (isClaimed) return 'CLAIM'
// 		return status === 'CLAIMED' ? 'CLAIM' : status
// 	}

// 	const getStatusColor = (status) => {
// 		if (status === 'FOUND') return 'bg-green-100 text-green-600'
// 		if (status === 'LOST') return 'bg-red-100 text-red-600'
// 		if (status === 'CLAIMED' || status === 'CLAIM') return 'bg-yellow-100 text-yellow-700'
// 		return 'bg-gray-100 text-gray-600'
// 	}

// 	const currentStatus = getDisplayStatus()

// 	const handleSubmitClaim = async () => {
// 		try {
// 			setIsSubmitting(true)
// 			await submitClaim(item._id)
// 			setHasSubmittedClaim(true)
// 			setIsClaimed(true)
// 			toast.success('Claim request submitted successfully! 🎉')
// 			if (refreshItems) refreshItems()
// 			setTimeout(() => onClose(), 1500)
// 		} catch (error) {
// 			toast.error(error?.response?.data?.message || 'Failed to submit claim ❌')
// 		} finally {
// 			setIsSubmitting(false)
// 		}
// 	}

// 	const handleToggleClaimed = async () => {
// 		if (isUpdating || isClaimed) return
// 		try {
// 			setIsUpdating(true)
// 			await markItemAsClaimed(item._id, true)
// 			setIsClaimed(true)
// 			toast.success('Item marked as claimed ✅')
// 			if (refreshItems) refreshItems()
// 		} catch (error) {
// 			toast.error(error?.response?.data?.message || 'Failed to update status ❌')
// 		} finally {
// 			setIsUpdating(false)
// 		}
// 	}

// 	return (
// 		<div className="w-full max-w-100 rounded-xl overflow-hidden shadow-xl relative bg-white animate-[fadeIn_.25s_ease]">
// 			<button
// 				onClick={onClose}
// 				className="absolute top-2.5 right-2.5 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center z-20 hover:bg-gray-50 transition text-xs"
// 			>
// 				✕
// 			</button>

// 			<div className="bg-blue-50 h-36 flex items-center justify-center relative">
// 				<span
// 					className={`absolute top-3 left-3 z-10 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(currentStatus)}`}
// 				>
// 					{currentStatus}
// 				</span>

// 				{item.image ? (
// 					<img src={item.image} alt="item" className="w-full h-full object-contain" />
// 				) : (
// 					<div className="text-6xl">📦</div>
// 				)}
// 			</div>

// 			<div className="p-4">
// 				<h2 className="text-lg font-bold leading-tight text-gray-800">
// 					{item.title || item.itemName || item.itemTitle || 'Untitled Item'}
// 				</h2>

// 				<div className="flex flex-wrap gap-2 mt-2 mb-3 text-xs">
// 					<span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-700">
// 						📍 {item.location || 'N/A'}
// 					</span>
// 					<span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600">
// 						📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently'}
// 					</span>
// 				</div>

// 				<div className="border-l-4 border-blue-200 pl-3 py-0.5 mb-4">
// 					<h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
// 						Description
// 					</h4>
// 					<p className="text-gray-600 text-xs leading-relaxed">
// 						{item.description || 'No description provided.'}
// 					</p>
// 				</div>

// 				<div className="mt-3 pt-3 border-t border-gray-100">
// 					<div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col gap-3">
// 						<div className="flex items-center justify-between gap-3">
// 							<div className="flex items-center gap-2.5">
// 								<div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
// 									{(item.name || item.postedBy?.name || 'U').charAt(0).toUpperCase()}
// 								</div>
// 								<div>
// 									<p className="font-semibold text-gray-800 text-xs">
// 										{item.name || item.postedBy?.name || 'User'}
// 									</p>
// 									<p className="text-[11px] text-gray-600 break-all">
// 										{item.email || item.postedBy?.email || 'No email'}
// 									</p>
// 								</div>
// 							</div>

// 							<div className="flex gap-2">
// 								<a
// 									href={`tel:${item.contactNumber || ''}`}
// 									className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
// 								>
// 									📞 Call
// 								</a>
// 								<a
// 									href={`mailto:${item.email || ''}`}
// 									className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
// 								>
// 									📧 Email
// 								</a>
// 							</div>
// 						</div>

// 						{isItemOwner && (
// 							<>
// 								{hasReportedBy ? (
// 									<div className="flex flex-col gap-3 border-t border-blue-100 pt-3">
// 										<p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
// 											🔍 Reported / Found By
// 										</p>

// 										<div className="flex items-center gap-2.5 bg-white/80 border border-gray-100 rounded-lg px-2 py-2">
// 											<div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
// 												{(item.reportedBy?.name || 'U').charAt(0).toUpperCase()}
// 											</div>
// 											<div className="flex-1 min-w-0">
// 												<div className="flex items-center justify-between gap-2">
// 													<p className="font-semibold text-gray-800 text-xs truncate">
// 														{item.reportedBy?.name || 'User'}
// 													</p>
// 													{item.reportedBy?.contactNumber && (
// 														<p className="text-[11px] text-gray-700 whitespace-nowrap flex-shrink-0">
// 															📞 {item.reportedBy.contactNumber}
// 														</p>
// 													)}
// 												</div>
// 												<p className="text-[11px] text-gray-600 break-all">
// 													{item.reportedBy?.email || 'No email'}
// 												</p>
// 											</div>
// 										</div>

// 										<div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg border border-blue-100">
// 											<span className="text-xs font-semibold text-gray-700">
// 												{isClaimed ? 'Claim Status' : 'Mark as Claim'}
// 											</span>
// 											<button
// 												type="button"
// 												onClick={handleToggleClaimed}
// 												disabled={isUpdating || isClaimed}
// 												title={
// 													isClaimed ? 'Already marked as claimed' : 'Mark this item as claimed'
// 												}
// 												className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
// 													isClaimed ? 'bg-green-500' : 'bg-gray-300'
// 												} ${
// 													isUpdating || isClaimed
// 														? 'opacity-60 cursor-not-allowed'
// 														: 'cursor-pointer hover:bg-gray-400'
// 												}`}
// 											>
// 												<span
// 													className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
// 														isClaimed ? 'translate-x-5' : 'translate-x-1'
// 													}`}
// 												/>
// 											</button>
// 										</div>

// 										{isClaimed && (
// 											<div className="bg-green-50 border border-green-200 py-2 px-4 rounded-xl flex items-center justify-center gap-2">
// 												<span className="text-green-600 text-sm">✅</span>
// 												<span className="text-[12px] font-bold text-green-700 uppercase tracking-tight">
// 													Marked as Claimed
// 												</span>
// 											</div>
// 										)}
// 									</div>
// 								) : (
// 									<div className="border-t border-blue-100 pt-3">
// 										<p className="text-xs text-gray-500 text-center">
// 											This is your posted item. Waiting for someone to report it found.
// 										</p>
// 									</div>
// 								)}
// 							</>
// 						)}

// 						{!isItemOwner && isReporter && (
// 							<div className="flex flex-col gap-3 border-t border-blue-100 pt-3">
// 								<p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
// 									You reported this item
// 								</p>

// 								<div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg border border-blue-100">
// 									<span className="text-xs font-semibold text-gray-700">
// 										{isClaimed ? 'Claim Status' : 'Mark as Claim'}
// 									</span>
// 									<button
// 										type="button"
// 										onClick={handleToggleClaimed}
// 										disabled={isUpdating || isClaimed}
// 										title={isClaimed ? 'Already marked as claimed' : 'Mark this item as claimed'}
// 										className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
// 											isClaimed ? 'bg-green-500' : 'bg-gray-300'
// 										} ${
// 											isUpdating || isClaimed
// 												? 'opacity-60 cursor-not-allowed'
// 												: 'cursor-pointer hover:bg-gray-400'
// 										}`}
// 									>
// 										<span
// 											className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
// 												isClaimed ? 'translate-x-5' : 'translate-x-1'
// 											}`}
// 										/>
// 									</button>
// 								</div>

// 								{isClaimed && (
// 									<div className="bg-green-50 border border-green-200 py-2 px-4 rounded-xl flex items-center justify-center gap-2">
// 										<span className="text-green-600 text-sm">✅</span>
// 										<span className="text-[12px] font-bold text-green-700 uppercase tracking-tight">
// 											Marked as Claimed
// 										</span>
// 									</div>
// 								)}
// 							</div>
// 						)}

// 						{!isItemOwner && !isReporter && (
// 							<>
// 								{hasReportedBy ? (
// 									<div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
// 										<p className="text-[10px] font-bold text-dark-500 uppercase tracking-wider">
// 											🔍 Already Reported By
// 										</p>
// 										<div className="flex items-center gap-2.5 bg-white/80 border border-gray-100 rounded-lg px-2 py-2">
// 											<div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
// 												{(item.reportedBy?.name || 'U').charAt(0).toUpperCase()}
// 											</div>
// 											<div className="flex-1 min-w-0">
// 												<div className="flex items-center justify-between gap-2">
// 													<p className="font-semibold text-gray-800 text-xs truncate">
// 														{item.reportedBy?.name || 'User'}
// 													</p>
// 													{item.reportedBy?.contactNumber && (
// 														<p className="text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0">
// 															📞 {item.reportedBy.contactNumber}
// 														</p>
// 													)}
// 												</div>
// 												<p className="text-[11px] text-gray-500 break-all">
// 													{item.reportedBy?.email || 'No email'}
// 												</p>
// 											</div>
// 										</div>
// 										<p className="text-[11px] text-gray-600 text-center pt-1">
// 											This item has already been reported by another user.
// 										</p>
// 									</div>
// 								) : (
// 									<div className="flex flex-col gap-3 border-t border-blue-100 pt-3">
// 										{!hasSubmittedClaim ? (
// 											<>
// 												<label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
// 													<input
// 														type="checkbox"
// 														checked={isChecked}
// 														onChange={(e) => setIsChecked(e.target.checked)}
// 														className="w-4 h-4 rounded"
// 													/>
// 													I confirm this item belongs to me
// 												</label>
// 												<button
// 													onClick={handleSubmitClaim}
// 													disabled={isSubmitting || !isChecked}
// 													className={`w-full py-2 rounded-lg font-bold text-xs transition ${
// 														isSubmitting || !isChecked
// 															? 'bg-gray-400 text-gray-200 cursor-not-allowed'
// 															: 'bg-gray-800 text-white hover:bg-gray-900 cursor-pointer'
// 													}`}
// 												>
// 													{isSubmitting ? 'Processing...' : 'Submit Claim'}
// 												</button>
// 											</>
// 										) : (
// 											<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
// 												<p className="text-xs font-bold text-green-700 text-center">
// 													✅ Your claim has been submitted successfully
// 												</p>
// 											</div>
// 										)}
// 									</div>
// 								)}
// 							</>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { submitClaim, markItemAsClaimed } from "../component/authApi/authApi";
import Img from "../assets/location_on_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png";

export default function ItemDetails({ item, onClose, refreshItems }) {
  let localStorageId = "";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    localStorageId = String(
      user?.id || user?._id || localStorage.getItem("userId") || "",
    );
  } catch {
    localStorageId = localStorage.getItem("userId") || "";
  }

  const itemUserId = String(item?.userId || "");
  const reportedById = String(
    item?.reportedBy?._id || item?.reportedBy?.id || "",
  );

  const isItemOwner =
    localStorageId && itemUserId && localStorageId === itemUserId;

  const hasReportedBy = !!item?.reportedBy && !!reportedById;

  const isReporter =
    localStorageId && reportedById && localStorageId === reportedById;

  const canToggleClaim = isItemOwner || isReporter;

  const getInitialClaimState = () => {
    const status = String(
      item?.itemStatus || item?.status || item?.type || "",
    ).toLowerCase();
    return status === "claimed" || status === "claim";
  };

  const [isClaimed, setIsClaimed] = useState(getInitialClaimState);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedClaim, setHasSubmittedClaim] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsClaimed(getInitialClaimState());
    setIsChecked(false);
    setHasSubmittedClaim(false);
  }, [item?._id, item?.itemStatus, item?.status, item?.type]);

  if (!item) return null;

  const getDisplayStatus = () => {
    const status = String(
      item?.itemStatus || item?.status || item?.type || "POSTED",
    ).toUpperCase();
    if (isClaimed) return "CLAIM";
    return status === "CLAIMED" ? "CLAIM" : status;
  };

  const getStatusColor = (status) => {
    if (status === "FOUND") return "bg-green-100 text-green-600";
    if (status === "LOST") return "bg-red-100 text-red-600";
    if (status === "CLAIMED" || status === "CLAIM")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const currentStatus = getDisplayStatus();

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
      toast.error(
        error?.response?.data?.message || "Failed to submit claim ❌",
      );
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
      toast.success("Item marked as claimed ✅");
      if (refreshItems) refreshItems();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update status ❌",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-100 rounded-xl overflow-hidden shadow-xl relative bg-white animate-[fadeIn_.25s_ease] mx-auto">
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center z-20 hover:bg-gray-50 transition text-xs"
      >
        ✕
      </button>

      <div className="bg-blue-50 h-36 flex items-center justify-center relative">
        <span
          className={`absolute top-3 left-3 z-10 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(currentStatus)}`}
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
          <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-700">
            <img
              src={Img}
              alt="Location"
              className="inline-block w-3 h-3 mr-1"
            />
            {item.location || "N/A"}
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {(item.name || item.postedBy?.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs">
                    {item.name || item.postedBy?.name || "User"}
                  </p>
                  <p className="text-[11px] text-gray-600 break-all">
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
                  📧 Email
                </a>
              </div>
            </div>

            {isItemOwner && (
              <>
                {hasReportedBy ? (
                  <div className="flex flex-col gap-3 border-t border-blue-100 pt-3">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                      🔍 Reported / Found By
                    </p>

                    <div className="flex items-center gap-2.5 bg-white/80 border border-gray-100 rounded-lg px-2 py-2">
                      <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {(item.reportedBy?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-gray-800 text-xs truncate">
                            {item.reportedBy?.name || "User"}
                          </p>
                          {item.reportedBy?.contactNumber && (
                            <p className="text-[11px] text-gray-700 whitespace-nowrap shrink-0">
                              📞 {item.reportedBy.contactNumber}
                            </p>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 break-all">
                          {item.reportedBy?.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg border border-blue-100">
                      <span className="text-xs font-semibold text-gray-700">
                        {isClaimed ? "Claim Status" : "Mark as Claim"}
                      </span>
                      <button
                        type="button"
                        onClick={handleToggleClaimed}
                        disabled={isUpdating || isClaimed}
                        title={
                          isClaimed
                            ? "Already marked as claimed"
                            : "Mark this item as claimed"
                        }
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                          isClaimed ? "bg-green-500" : "bg-gray-300"
                        } ${
                          isUpdating || isClaimed
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-400"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            isClaimed ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {isClaimed && (
                      <div className="bg-green-50 border border-green-200 py-2 px-4 rounded-xl flex items-center justify-center gap-2">
                        <span className="text-green-600 text-sm">✅</span>
                        <span className="text-[12px] font-bold text-green-700 uppercase tracking-tight">
                          Marked as Claimed
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-blue-100 pt-3">
                    <p className="text-xs text-gray-500 text-center">
                      This is your posted item. Waiting for someone to report it
                      found.
                    </p>
                  </div>
                )}
              </>
            )}

            {!isItemOwner && isReporter && (
              <div className="flex flex-col gap-3 border-t border-blue-100 pt-3">
                <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                  You reported this item
                </p>

                <div className="flex items-center justify-between bg-white/50 px-3 py-2 rounded-lg border border-blue-100">
                  <span className="text-xs font-semibold text-gray-700">
                    {isClaimed ? "Claim Status" : "Mark as Claim"}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleClaimed}
                    disabled={isUpdating || isClaimed}
                    title={
                      isClaimed
                        ? "Already marked as claimed"
                        : "Mark this item as claimed"
                    }
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                      isClaimed ? "bg-green-500" : "bg-gray-300"
                    } ${
                      isUpdating || isClaimed
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-400"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        isClaimed ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {isClaimed && (
                  <div className="bg-green-50 border border-green-200 py-2 px-4 rounded-xl flex items-center justify-center gap-2">
                    <span className="text-green-600 text-sm">✅</span>
                    <span className="text-[12px] font-bold text-green-700 uppercase tracking-tight">
                      Marked as Claimed
                    </span>
                  </div>
                )}
              </div>
            )}

            {!isItemOwner && !isReporter && (
              <>
                {isClaimed ? (
                  <div className="flex flex-col gap-3 border-t border-blue-100 pt-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-bold text-green-700 text-center">
                        🎉 This item has already been found / claimed.
                      </p>
                    </div>
                  </div>
                ) : hasReportedBy ? (
                  <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
                    <p className="text-[10px] font-bold text-dark-500 uppercase tracking-wider">
                      🔍 Already Reported By
                    </p>
                    <div className="flex items-center gap-2.5 bg-white/80 border border-gray-100 rounded-lg px-2 py-2">
                      <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {(item.reportedBy?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-gray-800 text-xs truncate">
                            {item.reportedBy?.name || "User"}
                          </p>
                          {item.reportedBy?.contactNumber && (
                            <p className="text-[11px] text-gray-500 whitespace-nowrap shrink-0">
                              📞 {item.reportedBy.contactNumber}
                            </p>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 break-all">
                          {item.reportedBy?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 text-center pt-1">
                      This item has already been reported by another user.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 border-t border-blue-100 pt-3">
                    {!hasSubmittedClaim ? (
                      <>
                        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
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
                      </>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-bold text-green-700 text-center">
                          ✅ Your claim has been submitted successfully
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
