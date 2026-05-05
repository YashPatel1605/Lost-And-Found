import React from 'react'
import { useNavigate } from 'react-router-dom'

const DynamicModal = ({ isOpen, onClose, message, buttonText = 'OK', navigateTo = null }) => {
	const navigate = useNavigate()

	if (!isOpen) return null

	const handleAction = () => {
		if (navigateTo) navigate(navigateTo)
		onClose()
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			<div className="relative bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 text-center transform transition-all duration-300 scale-100 animate-fadeIn">
				<div className="flex justify-center mb-4">
					<div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl">
						⚠️
					</div>
				</div>

				<h2 className="text-xl font-semibold text-gray-800 mb-2">Alert</h2>

				<p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

				<div className="flex justify-center gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
					>
						Cancel
					</button>

					<button
						onClick={handleAction}
						className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	)
}

export default DynamicModal
