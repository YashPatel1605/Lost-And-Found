import apiClient from '../../utils/apiClient'

export const registerUser = (data) => {
	return apiClient.post('/auth/register', data)
}

export const loginUser = async (data) => {
	const res = await apiClient.post('/auth/login', data)
	const responseData = res.data?.data || res.data
	const userData = responseData.user || responseData
	const token = responseData.token

	if (token) localStorage.setItem('token', token)
	if (userData) {
		localStorage.setItem('user', JSON.stringify(userData))
		localStorage.setItem('userId', userData._id || userData.id)
	}
	return res
}

export const forgotPassword = (email) => {
	return apiClient.post('/auth/forgot-password', { email })
}

export const resetPassword = (token, password) => {
	return apiClient.post(`/auth/reset-password`, { token, password })
}

export const getAllItems = (params = {}) => {
	return apiClient.get('/items', { params })
}

export const getItemById = (id) => {
	return apiClient.get(`/items/${id}`)
}

export const deleteItem = (id) => {
	return apiClient.delete(`/items/${id}`)
}

export const updateItem = async (id, data) => {
	return await apiClient.put(`/items/${id}`, data)
}

export const uploadImage = (file) => {
	const formData = new FormData()
	formData.append('image', file)

	return apiClient.post('/upload-image', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
}

export const reportItem = (data) => {
	return apiClient.post('/items/report-item', data)
}

export const submitClaim = (itemId) => {
	return apiClient.post('/items/update-report-item', { itemId })
}

export const markItemAsClaimed = async (id, isClaiming = true) => {
	return await apiClient.put(`/items/${id}`, { find: isClaiming, type: 'claim' })
}

export const contactAdmin = (data) => {
	return apiClient.post('/contacts', data)
}
