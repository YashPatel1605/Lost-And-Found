import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllItems, deleteItem, updateItem } from '../authApi/authApi'
import { toast } from 'react-toastify'
import Footer from '../Footer/Footer'

const myPostsStore = {
	userId: null,
	items: null,
	promise: null,
}

const getItemStatus = (item) => {
	if (item?.find === true) return 'CLAIMED'

	const rawStatus = String(
		item?.status || item?.itemStatus || item?.type || 'PENDING',
	).toUpperCase()

	return rawStatus === 'CLAIM' ? 'CLAIMED' : rawStatus
}

const isItemOwnedByUser = (item, userId) => {
	const normalizedUserId = String(userId || '')
	const ownerId = String(item?.userId || '')

	if (ownerId) {
		return ownerId === normalizedUserId
	}

	const fallbackOwnerId = String(item?.createdBy || item?.postedBy?._id || item?.postedBy?.id || '')

	return fallbackOwnerId === normalizedUserId
}

const shouldShowInMyPosts = (item, userId) => {
	return isItemOwnedByUser(item, userId)
}

const TableRowSkeleton = () => (
	<tr className="border-t animate-pulse">
		<td className="p-4">
			<div className="flex items-center gap-3 min-w-0">
				<div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
				<div className="h-4 bg-gray-200 rounded w-24"></div>
			</div>
		</td>
		<td className="p-4">
			<div className="h-4 bg-gray-200 rounded w-16"></div>
		</td>
		<td className="p-4">
			<div className="h-4 bg-gray-200 rounded w-20"></div>
		</td>
		<td className="p-4">
			<div className="h-6 bg-gray-200 rounded-full w-16"></div>
		</td>
		<td className="p-4">
			<div className="flex justify-center gap-2 flex-wrap">
				<div className="h-8 bg-gray-200 rounded w-24"></div>
				<div className="h-8 bg-gray-200 rounded w-12"></div>
				<div className="h-8 bg-gray-200 rounded w-12"></div>
			</div>
		</td>
	</tr>
)

const MobileCardSkeleton = () => (
	<div className="bg-white rounded-xl shadow p-4 space-y-3 animate-pulse">
		<div className="flex items-center gap-3">
			<div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
			<div className="h-4 bg-gray-200 rounded w-1/2"></div>
		</div>
		<div className="grid grid-cols-2 gap-3">
			<div className="h-3 bg-gray-100 rounded w-10"></div>
			<div className="h-3 bg-gray-200 rounded w-16 justify-self-end"></div>
			<div className="h-3 bg-gray-100 rounded w-10"></div>
			<div className="h-3 bg-gray-200 rounded w-16 justify-self-end"></div>
		</div>
		<div className="grid grid-cols-2 gap-2 pt-2">
			<div className="h-9 bg-gray-200 rounded-md"></div>
			<div className="h-9 bg-gray-200 rounded-md"></div>
		</div>
	</div>
)

export default function MyPosts() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [updatingItemId, setUpdatingItemId] = useState(null)
	const [deleteItemId, setDeleteItemId] = useState(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const updatingItemsRef = useRef(new Set())
	const navigate = useNavigate()

	const fetchItems = async (userId, forceRefresh = false) => {
		try {
			if (forceRefresh || !myPostsStore.items) setLoading(true)

			if (!forceRefresh && myPostsStore.userId === userId && Array.isArray(myPostsStore.items)) {
				setItems(myPostsStore.items)
				setLoading(false)
				return
			}

			if (!forceRefresh && myPostsStore.userId === userId && myPostsStore.promise) {
				const cachedItems = await myPostsStore.promise
				setItems(cachedItems)
				setLoading(false)
				return
			}

			myPostsStore.userId = userId
			myPostsStore.promise = getAllItems().then((res) => {
				const data = res?.data?.data?.items || res?.data?.data || res?.data || []
				const allItems = Array.isArray(data) ? data : []
				const myItems = allItems.filter((item) => shouldShowInMyPosts(item, userId))
				myPostsStore.items = myItems
				return myItems
			})

			const myItems = await myPostsStore.promise
			setItems(myItems)
		} catch (error) {
			console.error(error)
			toast.error('Failed to load items')
			setItems([])
			myPostsStore.items = null
		} finally {
			myPostsStore.promise = null
			setLoading(false)
		}
	}

	useEffect(() => {
		const userId = localStorage.getItem('userId')
		if (!userId) {
			toast.error('Please login to see your posts')
			navigate('/')
			return
		}
		fetchItems(userId)
	}, [navigate])

	useEffect(() => {
		const userId = localStorage.getItem('userId')
		if (!userId) return
		const refreshInterval = setInterval(() => {
			fetchItems(userId, true)
		}, 30000)
		return () => clearInterval(refreshInterval)
	}, [])

	const openDeleteModal = (id) => setDeleteItemId(id)
	const closeDeleteModal = () => !isDeleting && setDeleteItemId(null)

	const handleDelete = async () => {
		if (!deleteItemId) return
		try {
			setIsDeleting(true)
			await deleteItem(deleteItemId)
			toast.success('Item deleted successfully')
			setItems((prev) => {
				const updatedItems = prev.filter((item) => item._id !== deleteItemId)
				myPostsStore.items = updatedItems
				return updatedItems
			})
			setDeleteItemId(null)
		} catch (error) {
			console.error(error)
			toast.error('Delete failed')
		} finally {
			setIsDeleting(false)
		}
	}

	const handleEdit = (id) => navigate(`/edit-item/${id}`)

	const normalizeStatus = (item) => {
		return getItemStatus(item)
	}

	const getDisplayStatus = (item) => {
		const status = normalizeStatus(item)
		if (status === 'LOST') return { label: 'LOST', className: 'bg-red-100 text-red-700' }
		if (status === 'FOUND') return { label: 'FOUND', className: 'bg-green-100 text-green-700' }
		if (status === 'CLAIMED') return { label: 'CLAIMED', className: 'bg-blue-100 text-blue-700' }
		return { label: status, className: 'bg-yellow-100 text-yellow-700' }
	}

	const getTypeBadge = (item) => {
		const type = String(item?.type || '').toUpperCase()
		if (type === 'LOST') return { label: 'LOST', className: 'bg-red-100 text-red-700' }
		if (type === 'FOUND') return { label: 'FOUND', className: 'bg-green-100 text-green-700' }
		if (type === 'CLAIM' || type === 'CLAIMED')
			return { label: 'CLAIM', className: 'bg-blue-100 text-blue-700' }
		return { label: item?.type || 'N/A', className: 'bg-gray-100 text-gray-700' }
	}

	const buildUpdatedItem = (item, newStatus) => {
		const normalizedStatus = String(newStatus).toUpperCase()
		return {
			...item,
			status: normalizedStatus,
			itemStatus: normalizedStatus,
			type: normalizedStatus === 'CLAIMED' ? 'claim' : normalizedStatus.toLowerCase(),
			find: normalizedStatus === 'CLAIMED',
		}
	}

	const handleStatusChange = async (id, newStatus) => {
		if (updatingItemsRef.current.has(id)) return

		const currentItem = items.find((item) => item._id === id)
		if (!currentItem) return

		const userId = localStorage.getItem('userId')
		const previousItems = [...items]
		const updatedItem = buildUpdatedItem(currentItem, newStatus)
		const shouldKeepItem = shouldShowInMyPosts(updatedItem, userId)

		try {
			updatingItemsRef.current.add(id)
			setUpdatingItemId(id)

			setItems((prev) => {
				const next = shouldKeepItem
					? prev.map((item) => (item._id === id ? updatedItem : item))
					: prev.filter((item) => item._id !== id)
				myPostsStore.items = next
				return next
			})

			await updateItem(id, {
				status: updatedItem.status,
				itemStatus: updatedItem.itemStatus,
				type: updatedItem.type,
				find: updatedItem.find,
			})

			toast.success('Status updated successfully')
		} catch (error) {
			console.error(error)
			setItems(previousItems)
			myPostsStore.items = previousItems
			toast.error(error?.response?.data?.message || 'Failed to update status')
		} finally {
			updatingItemsRef.current.delete(id)
			setUpdatingItemId(null)
		}
	}

	const deleteItemData = items.find((item) => item._id === deleteItemId)

	return (
		<>
			<div className="min-h-screen flex flex-col bg-gray-50">
				<div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
						<div className="min-w-0">
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Posts</h1>
							<p className="text-gray-500 text-sm sm:text-base">
								Manage your active items linked to your account.
							</p>
						</div>
						<button
							onClick={() => navigate('/report')}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto whitespace-nowrap"
						>
							+ New Report
						</button>
					</div>

					<div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full min-w-225 text-left">
								<thead className="bg-gray-100 text-gray-600 text-sm uppercase">
									<tr>
										<th className="p-4 whitespace-nowrap">Item</th>
										<th className="p-4 whitespace-nowrap">Type</th>
										<th className="p-4 whitespace-nowrap">Date</th>
										<th className="p-4 whitespace-nowrap">Status</th>
										<th className="p-4 text-center whitespace-nowrap">Actions</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<>
											<TableRowSkeleton />
											<TableRowSkeleton />
											<TableRowSkeleton />
										</>
									) : Array.isArray(items) && items.length > 0 ? (
										items.map((item) => {
											const displayStatus = getDisplayStatus(item)
											const typeBadge = getTypeBadge(item)
											const currentStatus = normalizeStatus(item)

											return (
												<tr key={item._id} className="border-t">
													<td className="p-4">
														<div className="flex items-center gap-3 min-w-0">
															<div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
																📦
															</div>
															<span className="font-medium text-gray-800 truncate">
																{item.itemTitle || item.title || item.itemName || 'No Title'}
															</span>
														</div>
													</td>
													<td className="p-4">
														<span
															className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${typeBadge.className}`}
														>
															{typeBadge.label}
														</span>
													</td>
													<td className="p-4 text-gray-600 whitespace-nowrap">
														{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
													</td>
													<td className="p-4">
														<span
															className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${displayStatus.className}`}
														>
															{displayStatus.label}
														</span>
													</td>
													<td className="p-4">
														<div className="flex justify-center gap-2 flex-wrap">
															<select
																value={currentStatus}
																onChange={(e) => handleStatusChange(item._id, e.target.value)}
																disabled={updatingItemId === item._id}
																className={`px-3 py-2 rounded-md border text-sm font-medium outline-none min-w-30 ${
																	updatingItemId === item._id
																		? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
																		: 'bg-white text-gray-700 border-gray-300'
																}`}
															>
																<option value="PENDING">Pending</option>
																<option value="LOST">Lost</option>
																<option value="FOUND">Found</option>
																<option value="CLAIMED">Claimed</option>
															</select>

															<button
																onClick={() => handleEdit(item._id)}
																className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-md text-sm hover:bg-yellow-200 whitespace-nowrap"
															>
																Edit
															</button>

															<button
																onClick={() => openDeleteModal(item._id)}
																className="bg-red-100 text-red-600 px-3 py-2 rounded-md text-sm hover:bg-red-200 whitespace-nowrap"
															>
																Delete
															</button>
														</div>
													</td>
												</tr>
											)
										})
									) : (
										<tr>
											<td colSpan="5" className="text-center p-6 text-gray-500">
												No items found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="md:hidden space-y-4">
						{loading ? (
							<>
								<MobileCardSkeleton />
								<MobileCardSkeleton />
							</>
						) : Array.isArray(items) && items.length > 0 ? (
							items.map((item) => {
								const displayStatus = getDisplayStatus(item)
								const typeBadge = getTypeBadge(item)
								const currentStatus = normalizeStatus(item)

								return (
									<div key={item._id} className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-4">
										<div className="flex items-start gap-3">
											<div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
												📦
											</div>
											<h2 className="font-semibold text-gray-800 text-base sm:text-lg wrap-break-word">
												{item.itemTitle || item.title || item.itemName || 'No Title'}
											</h2>
										</div>

										<div className="grid grid-cols-2 gap-3 text-sm">
											<span className="text-gray-500">Type</span>
											<span className="justify-self-end px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${typeBadge.className}">
												{typeBadge.label}
											</span>
											<span className="text-gray-500">Status</span>
											<span
												className={`justify-self-end px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${displayStatus.className}`}
											>
												{displayStatus.label}
											</span>
										</div>

										<div className="pt-1">
											<select
												value={currentStatus}
												onChange={(e) => handleStatusChange(item._id, e.target.value)}
												disabled={updatingItemId === item._id}
												className={`w-full px-3 py-2 rounded-md border text-sm font-medium outline-none ${
													updatingItemId === item._id
														? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
														: 'bg-white text-gray-700 border-gray-300'
												}`}
											>
												<option value="PENDING">Pending</option>
												<option value="LOST">Lost</option>
												<option value="FOUND">Found</option>
												<option value="CLAIMED">Claimed</option>
											</select>
										</div>

										<div className="grid grid-cols-2 gap-2">
											<button
												onClick={() => handleEdit(item._id)}
												className="bg-yellow-100 text-yellow-700 py-2 rounded-md text-sm font-medium"
											>
												Edit
											</button>
											<button
												onClick={() => openDeleteModal(item._id)}
												className="bg-red-100 text-red-600 py-2 rounded-md text-sm font-medium"
											>
												Delete
											</button>
										</div>
									</div>
								)
							})
						) : (
							<p className="text-center text-gray-500">No items found</p>
						)}
					</div>
				</div>
			</div>

			{deleteItemId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
					<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
						<div className="p-5 sm:p-6">
							<div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center text-2xl mb-4">
								🗑️
							</div>
							<h2 className="text-xl font-bold text-center text-gray-800">Delete Item</h2>
							<p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
								Are you sure you want to delete{' '}
								<span className="font-semibold text-gray-700">
									{deleteItemData?.itemTitle || 'this item'}
								</span>
								? This action cannot be undone.
							</p>
							<div className="mt-6 flex flex-col sm:flex-row gap-3">
								<button
									onClick={closeDeleteModal}
									disabled={isDeleting}
									className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
								>
									Cancel
								</button>
								<button
									onClick={handleDelete}
									disabled={isDeleting}
									className={`flex-1 py-2.5 rounded-xl font-medium text-white transition ${
										isDeleting ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'
									}`}
								>
									{isDeleting ? 'Deleting...' : 'Yes, Delete'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
