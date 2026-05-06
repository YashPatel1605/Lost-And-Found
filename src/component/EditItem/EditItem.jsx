import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItemById, updateItem } from '../authApi/authApi'
import { toast } from 'react-toastify'

export default function EditItem() {
	const { id } = useParams()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [file, setFile] = useState(null)
	const [preview, setPreview] = useState(null)

	const [formData, setFormData] = useState({
		itemTitle: '',
		type: '',
		category: '',
		dateFound: '',
		description: '',
		location: '',
		name: '',
		contactNumber: '',
		email: '',
		image: '',
	})

	useEffect(() => {
		const fetchItem = async () => {
			try {
				const res = await getItemById(id)
				const item = res?.data?.data || res?.data || {}

				if (!item || Object.keys(item).length === 0) {
					toast.error('Item not found')
					return
				}

				setFormData({
					itemTitle: item.itemTitle || item.title || '',
					type: item.type || item.itemStatus || 'lost',
					category: item.category || '',
					dateFound: item.dateFound ? new Date(item.dateFound).toISOString().split('T')[0] : '',
					description: item.description || '',
					location: item.location || '',
					name: item.name || '',
					contactNumber: item.contactNumber || '',
					email: item.email || '',
					image: item.image || '',
				})

				setPreview(item.image || null)
			} catch (err) {
				console.error('Fetch Error:', err)
				toast.error('Failed to load item details')
			} finally {
				setLoading(false)
			}
		}

		if (id) fetchItem()
	}, [id])

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleFileChange = (e) => {
		const selected = e.target.files[0]
		if (!selected) return
		setFile(selected)
		setPreview(URL.createObjectURL(selected))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (isSubmitting) return
		setIsSubmitting(true)

		try {
			const data = new FormData()

			Object.keys(formData).forEach((key) => {
				data.append(key, formData[key])
			})

			if (file) {
				data.append('image', file)
			}

			await updateItem(id, data)

			toast.success('Item updated successfully ✅')
			navigate('/mypost', { replace: true })
		} catch (err) {
			console.error('Update Error:', err.response?.data)
			toast.error(err.response?.data?.message || 'Update failed ❌')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (loading) return <div className="text-center mt-20 font-semibold">Loading data...</div>

	return (
		<div className="min-h-screen bg-gray-50 p-6 flex justify-center">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-5"
			>
				<h2 className="text-2xl font-bold text-gray-800 border-b pb-3">Edit Post</h2>

				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">Update Photo</label>
					{preview && (
						<img
							src={preview}
							alt="preview"
							className="h-48 w-full object-cover rounded-lg border"
						/>
					)}
					<input
						type="file"
						onChange={handleFileChange}
						className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
				</div>

				<div className="space-y-4">
					<input
						name="itemTitle"
						value={formData.itemTitle}
						onChange={handleChange}
						placeholder="Item Title"
						className="w-full border p-3 rounded-lg"
						required
					/>

					<div className="flex gap-4">
						<select
							name="type"
							value={formData.type}
							onChange={handleChange}
							className="w-1/2 border p-3 rounded-lg"
							required
						>
							<option value="lost">Lost</option>
							<option value="found">Found</option>
						</select>
						<input
							type="date"
							name="dateFound"
							value={formData.dateFound}
							onChange={handleChange}
							className="w-1/2 border p-3 rounded-lg"
							required
						/>
					</div>

					<input
						name="location"
						value={formData.location}
						onChange={handleChange}
						placeholder="Location"
						className="w-full border p-3 rounded-lg"
					/>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Description"
						className="w-full border p-3 rounded-lg"
						rows={3}
					/>

					<hr />
					<p className="text-sm font-bold text-gray-500">Contact Details</p>

					<div className="space-y-1">
						<label className="text-xs text-gray-400 ml-1">Email Address (Read Only)</label>
						<input
							name="email"
							value={formData.email}
							readOnly
							className="w-full border p-3 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
						/>
					</div>

					<input
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Your Name"
						className="w-full border p-3 rounded-lg"
					/>
					<input
						name="contactNumber"
						value={formData.contactNumber}
						onChange={handleChange}
						placeholder="Phone Number"
						className="w-full border p-3 rounded-lg"
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className={`w-full py-3 rounded-lg font-bold text-white transition ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
				>
					{isSubmitting ? 'Saving Changes...' : 'Save Changes'}
				</button>
			</form>
		</div>
	)
}
