import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { toast } from 'react-toastify'
import { getAllItems } from '../authApi/authApi'
import SkeletonCard from '../SkeletonCard/SkeletonCard'
import LoginModal from '../../Modal/LoginModal'
import ItemDetails from '../../Modal/ItemDetails'

export default function BrowserAllItem({ searchQuery = '' }) {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [statusFilter, setStatusFilter] = useState('All Items')
	const [dateFilter, setDateFilter] = useState('All Dates')
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const [pendingItem, setPendingItem] = useState(null)
	const [selectedItem, setSelectedItem] = useState(null)

	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	const abortControllerRef = useRef(null)

	const getStatusInfo = (item) => {
		const status = (item.itemStatus || item.type || item.status || 'POSTED').toUpperCase()

		let colorClass = 'bg-gray-100 text-gray-700 border-gray-200'
		if (status === 'FOUND') colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200'
		if (status === 'LOST') colorClass = 'bg-rose-100 text-rose-700 border-rose-200'
		if (status === 'CLAIMED' || status === 'CLAIM')
			colorClass = 'bg-amber-100 text-amber-700 border-amber-200'

		return { label: status, className: colorClass }
	}

	const fetchItems = useCallback(async (currentStatus, page = 1, search = '', dateFilterValue = 'All Dates', isBackground = false) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}

		const controller = new AbortController()
		abortControllerRef.current = controller

		try {
			if (!isBackground) setLoading(true)

			const params = {
				page: page,
				limit: 10,
			}

			const normalized = currentStatus.toLowerCase()
			if (['found', 'lost', 'claim'].includes(normalized)) {
				params.type = normalized
			}

			const trimmedSearch = (search || '').trim()
			if (trimmedSearch) {
				params.search = trimmedSearch
				params.query = trimmedSearch
				params.q = trimmedSearch
			}

			const normalizedDateFilter = (dateFilterValue || '').trim()
			if (normalizedDateFilter && normalizedDateFilter !== 'All Dates') {
				params.dateFilter = normalizedDateFilter
			}

			const res = await getAllItems(params, controller.signal)

			const fetchedData = res.data?.data?.items || res.data?.items || []
			const paginationInfo = res.data?.data?.pagination || res.data?.pagination

			setItems(Array.isArray(fetchedData) ? fetchedData : [])

			if (paginationInfo) {
				setTotalPages(paginationInfo.totalPages || 1)
			}
		} catch (error) {
			if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
				console.error('Fetch failed:', error)
				if (!isBackground) toast.error('Could not load items')
			}
		} finally {
			if (!isBackground) setLoading(false)
		}
	}, [])

	useEffect(() => {
		setCurrentPage(1)
	}, [statusFilter, searchQuery, dateFilter])

	useEffect(() => {
		fetchItems(statusFilter, currentPage, searchQuery, dateFilter)
	}, [currentPage, statusFilter, searchQuery, dateFilter, fetchItems])

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// const filteredData = useMemo(() => {
	// 	return items.filter((item) => {
	// 		if (dateFilter === 'All Dates') return true

	// 		const dateStr = item.createdAt || item.date
	// 		if (!dateStr) return false
	// 		const itemDate = new Date(dateStr)
	// 		const now = new Date()

	// 		if (dateFilter === 'Today') return itemDate.toDateString() === now.toDateString()
	// 		if (dateFilter === 'This Week') {
	// 			const weekAgo = new Date()
	// 			weekAgo.setDate(now.getDate() - 7)
	// 			return itemDate >= weekAgo
	// 		}
	// 		if (dateFilter === 'This Month') {
	// 			return (
	// 				itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
	// 			)
	// 		}
	// 		return true
	// 	})
	// }, [items, dateFilter])

	const filteredData = useMemo(() => {
    const now = new Date()

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    const startOfWeek = new Date(now)
    const day = startOfWeek.getDay()
    const diffToMonday = day === 0 ? 6 : day - 1
    startOfWeek.setDate(now.getDate() - diffToMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return items.filter((item) => {
        if (dateFilter === 'All Dates') return true

        const dateStr = item.createdAt || item.date
        if (!dateStr) return false

        const itemDate = new Date(dateStr)
        if (isNaN(itemDate.getTime())) return false

        switch (dateFilter) {
            case 'Today':
                return itemDate >= startOfToday && itemDate < endOfToday
            case 'This Week':
                return itemDate >= startOfWeek && itemDate < endOfWeek
            case 'This Month':
                return itemDate >= startOfMonth && itemDate < endOfMonth
            default:
                return true
        }
    })
}, [items, dateFilter])

	const handleCardClick = (item) => {
		const token = localStorage.getItem('token')
		if (token) setSelectedItem(item)
		else {
			setPendingItem(item)
			toast.info('Please login to view full details 🔑')
			setIsLoginModalOpen(true)
		}
	}

	const handleItemRefresh = async (updatedItem = null) => {
		if (updatedItem?._id) {
			setItems((prev) => prev.map((it) => (it._id === updatedItem._id ? updatedItem : it)))
		} else {
			fetchItems(statusFilter, currentPage, searchQuery, dateFilter, true)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
			<div
				className={`max-w-7xl mx-auto transition-all duration-300 ${selectedItem ? 'blur-md' : ''}`}
			>
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<span className="text-gray-500 text-xs font-bold uppercase tracking-wider shrink-0">
							Status:
						</span>
						<div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
							{['All Items', 'Found', 'Lost', 'Claim'].map((status) => (
								<button
									key={status}
									onClick={() => setStatusFilter(status)}
									className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer active:scale-95 ${
										statusFilter === status
											? 'bg-blue-600 text-white shadow-md'
											: 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
							className="w-full md:w-52 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer appearance-none"
						>
							<option value="All Dates">All Dates</option>
							<option value="Today">Today</option>
							<option value="This Week">This Week</option>
							<option value="This Month">This Month</option>
						</select>
						<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{loading ? (
						Array(6)
							.fill(0)
							.map((_, i) => <SkeletonCard key={i} />)
					) : filteredData.length > 0 ? (
						filteredData.map((item) => {
							const status = getStatusInfo(item)

							return (
								<div
									key={item._id}
									onClick={() => handleCardClick(item)}
									className="group flex flex-col cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
								>
									<div className="relative h-44 w-full bg-gray-50 flex items-center justify-center overflow-hidden p-3 border-b border-gray-50">
										<span
											className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border shadow-sm ${status.className}`}
										>
											{status.label}
										</span>

										{item.image ? (
											<img
												src={item.image}
												alt={item.title || 'item'}
												className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
											/>
										) : (
											<div className="text-6xl drop-shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out">
												{item.category === 'Electronics'
													? '📱'
													: item.category === 'ID Cards'
														? '🪪'
														: '📦'}
											</div>
										)}
									</div>

									<div className="flex flex-col grow p-5">
										<h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1.5">
											{item.itemTitle || item.itemName || item.title || 'Untitled Item'}
										</h3>

										<p className="text-sm text-gray-500 line-clamp-2 mb-4 grow">
											{item.description || 'No description provided.'}
										</p>

										<div className="flex flex-col gap-2 text-xs text-gray-500 font-medium mb-4">
											<div className="flex items-center gap-1.5">
												<svg
													className="w-3.5 h-3.5 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
													></path>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
													></path>
												</svg>
												<span className="truncate">{item.location || 'Unknown Location'}</span>
											</div>
											<div className="flex items-center gap-1.5">
												<svg
													className="w-3.5 h-3.5 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													></path>
												</svg>
												<span>
													{item.createdAt
														? new Date(item.createdAt).toLocaleDateString(undefined, {
																year: 'numeric',
																month: 'short',
																day: 'numeric',
															})
														: 'Recently'}
												</span>
											</div>
										</div>

										<div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
											<div className="flex items-center gap-2">
												<div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold">
													{(item.name || item.postedBy?.name || 'U').charAt(0).toUpperCase()}
												</div>
												<span className="text-xs text-gray-700 font-semibold truncate max-w-25">
													{item.name || item.postedBy?.name || 'User'}
												</span>
											</div>

											<div className="text-blue-600 text-xs font-bold flex items-center group-hover:text-blue-800 transition-colors">
												View
												<svg
													className="w-3.5 h-3.5 ml-0.5 transform group-hover:translate-x-1 transition-transform"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M9 5l7 7-7 7"
													/>
												</svg>
											</div>
										</div>
									</div>
								</div>
							)
						})
					) : (
						<div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
							<div className="text-6xl mb-4">🔍</div>
							No items found matching your filters.
						</div>
					)}
				</div>

				{totalPages > 1 && !loading && (
					<div className="mt-16 flex justify-center items-center gap-2 md:gap-4 pb-10">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
								currentPage === 1
									? 'bg-gray-200 text-gray-400 cursor-not-allowed'
									: 'bg-white text-blue-600 shadow-sm hover:bg-blue-50'
							}`}
						>
							Previous
						</button>

						<div className="flex gap-1 md:gap-2">
							{[...Array(totalPages)].map((_, index) => {
								const pageNum = index + 1
								return (
									<button
										key={pageNum}
										onClick={() => handlePageChange(pageNum)}
										className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
											currentPage === pageNum
												? 'bg-blue-600 text-white shadow-md scale-110'
												: 'bg-white text-gray-500 hover:bg-gray-50'
										}`}
									>
										{pageNum}
									</button>
								)
							})}
						</div>

						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
								currentPage === totalPages
									? 'bg-gray-200 text-gray-400 cursor-not-allowed'
									: 'bg-white text-blue-600 shadow-sm hover:bg-blue-50'
							}`}
						>
							Next
						</button>
					</div>
				)}
			</div>

			{selectedItem && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
						onClick={() => setSelectedItem(null)}
					></div>
					<div className="relative z-50 w-full max-w-2xl animate-in fade-in zoom-in duration-300">
						<ItemDetails
							item={selectedItem}
							onClose={() => setSelectedItem(null)}
							refreshItems={handleItemRefresh}
						/>
					</div>
				</div>
			)}

			<LoginModal
				isOpen={isLoginModalOpen}
				onClose={() => setIsLoginModalOpen(false)}
				onLoginSuccess={() => {
					if (pendingItem) {
						setSelectedItem(pendingItem)
						setPendingItem(null)
					}
					setIsLoginModalOpen(false)
				}}
			/>
		</div>
	)
}
