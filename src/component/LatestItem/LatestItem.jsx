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

	const isItemClaimed = (item) => {
		const status = (item.itemStatus || item.status || '').toUpperCase()
		return status === 'CLAIMED' || item.find === true
	}

	const getStatusInfo = (item) => {
		const status = (item.itemStatus || item.type || item.status || 'POSTED').toUpperCase()

		let colorClass = 'bg-gray-100 text-gray-600'
		if (status === 'FOUND') colorClass = 'bg-green-100 text-green-600'
		if (status === 'LOST') colorClass = 'bg-red-100 text-red-600'
		if (status === 'CLAIMED') colorClass = 'bg-yellow-100 text-yellow-700'

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
		<section className="bg-gray-100 py-10 px-4 md:px-8 min-h-screen relative">
			<div
				className={`max-w-7xl mx-auto flex flex-col transition-all duration-300 ${
					selectedItem ? 'blur-sm' : ''
				}`}
			>
				<div className="text-center mb-10">
					<span className="text-blue-600 bg-blue-100 px-4 py-1 rounded-full text-sm font-medium uppercase tracking-wide">
						Recent Listings
					</span>
					<h2 className="text-3xl md:text-5xl font-bold text-gray-800 mt-3">Latest Items</h2>
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
								const claimed = isItemClaimed(item)

								return (
									<div
										key={item._id}
										onClick={() => handleCardClick(item)}
										className="group cursor-pointer bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
									>
										<div className="bg-blue-50 h-48 flex items-center justify-center relative">
											<span
												className={`absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-full uppercase ${status.className}`}
											>
												{status.label}
											</span>

											{item.image ? (
												<img
													src={item.image}
													alt={item.title || 'item'}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											) : (
												<div className="text-6xl group-hover:scale-110 transition-transform duration-300">
													{item.category === 'Electronics'
														? '📱'
														: item.category === 'ID Cards'
															? '🪪'
															: '📦'}
												</div>
											)}
										</div>

										<div className="p-6">
											<h3 className="text-xl font-bold text-gray-800 truncate">
												{item.itemTitle || item.itemName || item.title || 'Untitled Item'}
											</h3>

											<p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-10">
												{item.description}
											</p>

											<div className="text-xs text-gray-400 mt-4 space-y-1 font-medium">
												<p>📍 {item.location}</p>
												<p>
													📅{' '}
													{item.createdAt
														? new Date(item.createdAt).toLocaleDateString()
														: 'Recently'}
												</p>
											</div>

											<div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase ring-2 ring-blue-50">
														{(item.name || item.postedBy?.name || 'U').charAt(0)}
													</div>
													<span className="text-sm text-gray-700 font-medium truncate max-w-25">
														{item.name || item.postedBy?.name || 'User'}
													</span>
												</div>

												<button
													type="button"
													onClick={(event) => {
														event.stopPropagation()
														handleCardClick(item)
													}}
													className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors"
												>
													View →
												</button>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>

				{!loading && items.length > 0 && (
					<div className="flex justify-center mt-16 mb-10">
						<button
							onClick={() => navigate('/browse')}
							className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 active:scale-95"
						>
							View All Items <span className="text-xl">→</span>
						</button>
					</div>
				)}
			</div>

			{selectedItem && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
					<div
						className="absolute inset-0 bg-black/30 backdrop-blur-md"
						onClick={() => setSelectedItem(null)}
					></div>

					<div className="relative z-50 w-full flex items-center justify-center">
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
