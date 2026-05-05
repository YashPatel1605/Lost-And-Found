import React, { useState } from 'react'
import { toast } from 'react-toastify'
import LoginModal from '../../Modal/LoginModal'
import ItemDetails from '../../Modal/ItemDetails'
import SkeletonCard from '../SkeletonCard/SkeletonCard'
import { useNavigate } from 'react-router-dom'

export default function LatestItems({ items = [], loading = false, onItemUpdate }) {
	const navigate = useNavigate()

	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState(null)
	const [pendingItem, setPendingItem] = useState(null)

	const handleCardClick = (item) => {
		const token = localStorage.getItem('token')
		if (token) {
			setSelectedItem(item)
		} else {
			setPendingItem(item)
			toast.info('Please login to view full details 🔑')
			setIsLoginModalOpen(true)
		}
	}

	const getStatusInfo = (item) => {
		const status = (item.itemStatus || item.type || item.status || 'POSTED').toUpperCase()

		let colorClass = 'bg-gray-100 text-gray-700 border-gray-200'
		if (status === 'FOUND') colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200'
		if (status === 'LOST') colorClass = 'bg-rose-100 text-rose-700 border-rose-200'
		if (status === 'CLAIMED' || status === 'CLAIM')
			colorClass = 'bg-amber-100 text-amber-700 border-amber-200'

		return { label: status, className: colorClass }
	}

	const handleLoginSuccess = () => {
		if (pendingItem) {
			setSelectedItem(pendingItem)
			setPendingItem(null)
			setIsLoginModalOpen(false)
		}
	}

	const handleItemRefresh = (updatedItemFromChild = null) => {
		if (updatedItemFromChild?._id) {
			setSelectedItem(updatedItemFromChild)
			if (onItemUpdate) onItemUpdate(updatedItemFromChild)
		}
	}

	const visibleItems = items.slice(0, 6)

	return (
		<section className="bg-gray-50 py-12 px-4 md:px-8 min-h-screen relative">
			<div
				className={`max-w-7xl mx-auto flex flex-col transition-all duration-300 ${
					selectedItem ? 'blur-sm' : ''
				}`}
			>
				<div className="text-center mb-10">
					<span className="text-blue-600 bg-blue-100/50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
						Recent Listings
					</span>
					<h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
						Latest Items
					</h2>
				</div>

				<div className="grow">
					{loading ? (
						<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{[...Array(3)].map((_, index) => (
								<SkeletonCard key={index} />
							))}
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{visibleItems.map((item) => {
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

										<div className="flex flex-col flex-grow p-4 md:p-5">
											<h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1.5">
												{item.itemTitle || item.itemName || item.title || 'Untitled Item'}
											</h3>

											<p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
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
													<span className="text-xs text-gray-700 font-semibold truncate max-w-[100px]">
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
							})}
						</div>
					)}
				</div>

				{!loading && items.length > 0 && (
					<div className="flex justify-center mt-12 mb-8">
						<button
							onClick={() => navigate('/browse')}
							className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all duration-300 active:scale-95"
						>
							View All Items
							<svg
								className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</button>
					</div>
				)}
			</div>

			{selectedItem && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
						onClick={() => setSelectedItem(null)}
					></div>

					<div className="relative z-50 w-full flex items-center justify-center animate-in fade-in zoom-in duration-200">
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
				onLoginSuccess={handleLoginSuccess}
			/>
		</section>
	)
}
