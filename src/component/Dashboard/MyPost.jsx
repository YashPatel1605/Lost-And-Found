import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllItems, deleteItem, updateItem } from '../authApi/authApi'
import { toast } from 'react-toastify'
import { MobileCardSkeleton, TableRowSkeleton } from '../../utils/SkalitoneLoader'
import { EmptyState } from '../../utils/EmptyState'

const myPostsStore = {
	userId: null,
	items: null,
	promise: null,
}

const ITEMS_PER_PAGE = 5

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

	if (ownerId) return ownerId === normalizedUserId

	const fallbackOwnerId = String(item?.createdBy || item?.postedBy?._id || item?.postedBy?.id || '')

	return fallbackOwnerId === normalizedUserId
}

const shouldShowInMyPosts = (item, userId) => {
	return isItemOwnedByUser(item, userId)
}

export default function MyPosts() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [updatingItemId, setUpdatingItemId] = useState(null)
	const [deleteItemId, setDeleteItemId] = useState(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)

	const navigate = useNavigate()

	const hasFetchedRef = useRef(false)
	const updatingItemsRef = useRef(new Set())
	const isMountedRef = useRef(true)

	useEffect(() => {
		isMountedRef.current = true
		return () => {
			isMountedRef.current = false
		}
	}, [])

	const fetchItems = useCallback(async (userId, forceRefresh = false) => {
		try {
			if (!forceRefresh && myPostsStore.userId === userId && Array.isArray(myPostsStore.items)) {
				if (isMountedRef.current) {
					setItems(myPostsStore.items)
					setLoading(false)
				}
				return
			}

			if (!forceRefresh && myPostsStore.userId === userId && myPostsStore.promise) {
				setLoading(true)
				const cachedItems = await myPostsStore.promise
				if (isMountedRef.current) {
					setItems(cachedItems)
					setLoading(false)
				}
				return
			}

			if (isMountedRef.current) setLoading(true)

			myPostsStore.userId = userId

			const requestPromise = getAllItems().then((res) => {
				const data = res?.data?.data?.items || res?.data?.data || res?.data || []
				const allItems = Array.isArray(data) ? data : []
				const myItems = allItems.filter((item) => shouldShowInMyPosts(item, userId))
				myPostsStore.items = myItems
				return myItems
			})

			myPostsStore.promise = requestPromise

			const myItems = await requestPromise

			if (isMountedRef.current) {
				setItems(myItems)
			}
		} catch (error) {
			console.error(error)
			if (isMountedRef.current) {
				toast.error('Failed to load items')
				setItems([])
			}
			myPostsStore.items = null
		} finally {
			myPostsStore.promise = null
			if (isMountedRef.current) {
				setLoading(false)
			}
		}
	}, [])

	useEffect(() => {
		const userId = localStorage.getItem('userId')

		if (!userId) {
			toast.error('Please login to see your posts')
			navigate('/')
			return
		}

		fetchItems(userId, true)
	}, [navigate, fetchItems])

	const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)

	const paginatedItems = items.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	)

	const goToPage = (page) => {
		if (page < 1 || page > totalPages) return
		setCurrentPage(page)
	}

	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages)
		}
		if (totalPages === 0 && currentPage !== 1) {
			setCurrentPage(1)
		}
	}, [totalPages, currentPage])

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

		if (status === 'LOST') {
			return { label: 'LOST', className: 'bg-red-100 text-red-700' }
		}
		if (status === 'FOUND') {
			return { label: 'FOUND', className: 'bg-green-100 text-green-700' }
		}
		if (status === 'CLAIMED' || status === 'CLAIM') {
			return { label: 'CLAIMED', className: 'bg-blue-100 text-blue-700' }
		}

		return { label: status, className: 'bg-yellow-100 text-yellow-700' }
	}

	const getTypeBadge = (item) => {
		const type = String(item?.type || '').toUpperCase()

		if (type === 'LOST') {
			return { label: 'LOST', className: 'bg-red-100 text-red-700' }
		}
		if (type === 'FOUND') {
			return { label: 'FOUND', className: 'bg-green-100 text-green-700' }
		}
		if (type === 'CLAIM' || type === 'CLAIMED') {
			return { label: 'CLAIM', className: 'bg-blue-100 text-blue-700' }
		}

		return {
			label: item?.type || 'N/A',
			className: 'bg-gray-100 text-gray-700',
		}
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

	const renderPagination = () => {
		if (totalPages <= 1) return null

		const getPageNumbers = () => {
			const pages = []
			const maxVisible = 5

			if (totalPages <= maxVisible) {
				for (let i = 1; i <= totalPages; i++) pages.push(i)
			} else {
				if (currentPage <= 3) {
					for (let i = 1; i <= 4; i++) pages.push(i)
					pages.push('...')
					pages.push(totalPages)
				} else if (currentPage >= totalPages - 2) {
					pages.push(1)
					pages.push('...')
					for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
				} else {
					pages.push(1)
					pages.push('...')
					for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
					pages.push('...')
					pages.push(totalPages)
				}
			}

			return pages
		}

		return (
			<div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 pb-6">
				<button
					onClick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
				>
					Previous
				</button>

				{getPageNumbers().map((page, index) =>
					page === '...' ? (
						<span key={`dots-${index}`} className="px-2 py-2 text-gray-400 text-sm">
							...
						</span>
					) : (
						<button
							key={page}
							onClick={() => goToPage(page)}
							className={`w-10 h-10 rounded-lg text-sm font-medium cursor-pointer ${
								currentPage === page
									? 'bg-blue-600 text-white'
									: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
							}`}
						>
							{page}
						</button>
					),
				)}

				<button
					onClick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
				>
					Next
				</button>
			</div>
		)
	}

	return (
		<>
			<div className="min-h-screen flex flex-col bg-gray-50">
				<div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
						<div className="min-w-0">
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Posts</h1>
							<p className="text-gray-500 text-sm sm:text-base mt-1">
								Manage your active items linked to your account.
							</p>
						</div>

						{items.length > 0 && (
							<button
								onClick={() => navigate('/report')}
								className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium w-full sm:w-auto whitespace-nowrap cursor-pointer shadow-sm transition"
							>
								+ New Report
							</button>
						)}
					</div>

					{loading ? (
						<>
							<div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
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
										{Array(10)
											.fill(0)
											.map((_, index) => (
												<TableRowSkeleton key={index} />
											))}
									</tbody>
								</table>
							</div>

							<div className="md:hidden space-y-4">
								{Array(10)
									.fill(0)
									.map((_, index) => (
										<MobileCardSkeleton key={index} />
									))}
							</div>
						</>
					) : items.length === 0 ? (
						<EmptyState onAction={() => navigate('/report')} />
					) : (
						<>
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
											{paginatedItems.map((item) => {
												const displayStatus = getDisplayStatus(item)
												const typeBadge = getTypeBadge(item)
												const currentStatus = normalizeStatus(item)

												return (
													<tr key={item._id} className="border-t hover:bg-gray-50/50 transition">
														<td className="p-4">
															<div className="flex items-center gap-3 min-w-0">
																<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 text-lg">
																	📦
																</div>
																<span className="font-medium text-gray-800 truncate">
																	{item.itemTitle || item.title || item.itemName || 'No Title'}
																</span>
															</div>
														</td>

														<td className="p-4">
															<span
																className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide ${typeBadge.className}`}
															>
																{typeBadge.label}
															</span>
														</td>

														<td className="p-4 text-gray-600 whitespace-nowrap">
															{item.createdAt
																? new Date(item.createdAt).toLocaleDateString()
																: 'N/A'}
														</td>

														<td className="p-4">
															<span
																className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide ${displayStatus.className}`}
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
																			: 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer'
																	}`}
																>
																	<option value="PENDING">Pending</option>
																	<option value="LOST">Lost</option>
																	<option value="FOUND">Found</option>
																	<option value="CLAIMED">Claimed</option>
																</select>

																<button
																	onClick={() => handleEdit(item._id)}
																	className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-100 transition whitespace-nowrap cursor-pointer"
																>
																	Edit
																</button>

																<button
																	onClick={() => openDeleteModal(item._id)}
																	className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition whitespace-nowrap cursor-pointer"
																>
																	Delete
																</button>
															</div>
														</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
								{renderPagination()}
							</div>

							<div className="md:hidden space-y-4">
								{paginatedItems.map((item) => {
									const displayStatus = getDisplayStatus(item)
									const typeBadge = getTypeBadge(item)
									const currentStatus = normalizeStatus(item)

									return (
										<div key={item._id} className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-4">
											<div className="flex items-start gap-3">
												<div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shrink-0 text-xl">
													📦
												</div>
												<h2 className="font-semibold text-gray-800 text-base sm:text-lg wrap-break-words mt-1">
													{item.itemTitle || item.title || item.itemName || 'No Title'}
												</h2>
											</div>

											<div className="grid grid-cols-2 gap-3 text-sm items-center">
												<span className="text-gray-500">Type</span>
												<span
													className={`justify-self-end px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide ${typeBadge.className}`}
												>
													{typeBadge.label}
												</span>

												<span className="text-gray-500">Status</span>
												<span
													className={`justify-self-end px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide ${displayStatus.className}`}
												>
													{displayStatus.label}
												</span>
											</div>

											<div className="pt-1">
												<select
													value={currentStatus}
													onChange={(e) => handleStatusChange(item._id, e.target.value)}
													disabled={updatingItemId === item._id}
													className={`w-full px-3 py-2.5 rounded-md border text-sm font-medium outline-none ${
														updatingItemId === item._id
															? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
															: 'bg-white text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
													}`}
												>
													<option value="PENDING">Pending</option>
													<option value="LOST">Lost</option>
													<option value="FOUND">Found</option>
													<option value="CLAIMED">Claimed</option>
												</select>
											</div>

											<div className="grid grid-cols-2 gap-3 pt-1">
												<button
													onClick={() => handleEdit(item._id)}
													className="bg-yellow-50 text-yellow-700 border border-yellow-200 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-100 transition"
												>
													Edit
												</button>
												<button
													onClick={() => openDeleteModal(item._id)}
													className="bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
												>
													Delete
												</button>
											</div>
										</div>
									)
								})}
								{renderPagination()}
							</div>
						</>
					)}
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
									className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
								>
									Cancel
								</button>

								<button
									onClick={handleDelete}
									disabled={isDeleting}
									className={`flex-1 py-2.5 rounded-xl font-medium text-white transition cursor-pointer ${
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
