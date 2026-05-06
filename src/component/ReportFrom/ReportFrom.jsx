import React, { useEffect, useRef, useState } from 'react'
import { uploadImage, reportItem } from '../authApi/authApi'
import { toast } from 'react-toastify'

export default function ReportForm({ selectedType }) {
	const fileInputRef = useRef(null)
	const [file, setFile] = useState(null)
	const [preview, setPreview] = useState(null)
	const [loading, setLoading] = useState(false)

	const [formData, setFormData] = useState({
		type: selectedType || 'found',
		itemTitle: '',
		dateFound: '',
		description: '',
		location: '',
		name: '',
		contactNumber: '',
		email: '',
	})

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			type: selectedType,
		}))
	}, [selectedType])

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0]
		if (!selectedFile) return

		if (!['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)) {
			toast.error('Only PNG and JPG images are allowed ❌')
			return
		}

		setFile(selectedFile)
		setPreview(URL.createObjectURL(selectedFile))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		// 1. Basic Validation
		if (
			!formData.itemTitle ||
			!formData.dateFound ||
			!formData.description ||
			!formData.location ||
			!formData.name ||
			!formData.contactNumber ||
			!formData.email
		) {
			toast.warn('Please fill all required fields ⚠️')
			return
		}

		setLoading(true)

		try {
			let uploadedImageUrl = ''

			// 2. Handle Image Upload if file exists
			if (file) {
				const uploadRes = await uploadImage(file)
				uploadedImageUrl =
					uploadRes?.data?.url || uploadRes?.data?.imageUrl || uploadRes?.data?.image || ''
			}

			// 3. Construct Final Payload
			const finalReport = {
				...formData,
				category: 'General',
				image: uploadedImageUrl,
				userId: localStorage.getItem('userId'),
			}

			//   console.log("Submitting Data to API:", finalReport);
			const res = await reportItem(finalReport)

			//  console.log("API Response:", res.data);
			// console.log("res", res);
			toast.success('Report submitted successfully! 🎉')

			setTimeout(() => {
				window.location.href = '/browse'
			}, 2000)
		} catch (err) {
			console.error('❌ Submit Error:', err.response?.data || err.message)

			toast.error(err.response?.data?.message || 'Failed to submit report ❌')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="bg-gray-100 pb-10 px-4 md:px-8">
			<form
				onSubmit={handleSubmit}
				className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10"
			>
				{/* Image Upload - Styled per your design */}
				<div className="mb-6">
					<label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
					<div
						onClick={() => fileInputRef.current.click()}
						className="border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-10 text-center hover:border-blue-400 cursor-pointer transition"
					>
						{preview ? (
							<img
								src={preview}
								alt="preview"
								className="mx-auto max-h-48 rounded-lg object-cover"
							/>
						) : (
							<div className="text-gray-500">📷 Click to upload image</div>
						)}
					</div>
				</div>

				<input
					type="file"
					accept="image/*"
					ref={fileInputRef}
					onChange={handleFileChange}
					className="hidden"
				/>

				<div className="space-y-5">
					{/* Item Title */}
					<div>
						<label className="block text-gray-700 font-semibold mb-1">Item Title *</label>
						<input
							name="itemTitle"
							value={formData.itemTitle}
							onChange={handleInputChange}
							placeholder="Item Title"
							className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-400"
							required
						/>
					</div>

					{/* Date */}
					<div>
						<label className="block text-gray-700 font-semibold mb-1">Date*</label>
						<input
							type="date"
							name="dateFound"
							value={formData.dateFound}
							onChange={handleInputChange}
							className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-400"
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-gray-700 font-semibold mb-1">Description *</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Description"
							rows="3"
							className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-400"
							required
						/>
					</div>

					{/* Location */}
					<div>
						<label className="block text-gray-700 font-semibold mb-1">Location *</label>
						<input
							name="location"
							value={formData.location}
							onChange={handleInputChange}
							placeholder="Location"
							className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-400"
							required
						/>
					</div>

					{/* Name and Contact Number Grid */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-gray-700 font-semibold mb-1">Name *</label>
							<input
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Name"
								className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-400"
								required
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-1">Contact Number *</label>
							<input
								name="contactNumber"
								type="tel"
								value={formData.contactNumber}
								onChange={handleInputChange}
								placeholder="10-digit phone number"
								className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-400"
								required
								minLength="10"
								maxLength="15"
							/>
							{formData.contactNumber && formData.contactNumber.length < 10 && (
								<p className="text-red-500 text-xs mt-1">Number must be at least 10 digits.</p>
							)}
						</div>
					</div>

					{/* Email */}
					<div>
						<label className="block text-gray-700 font-semibold mb-1">Email *</label>
						<input
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Email"
							type="email"
							className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-400"
							required
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full mt-8 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
				>
					{loading ? 'Submitting...' : 'Submit Report'}
				</button>
			</form>
		</div>
	)
}
