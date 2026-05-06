import axios from 'axios'

const apiUrl = import.meta.env.VITE_BACKEND_API_URL

const apiClient = axios.create({
	baseURL: apiUrl,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token')
			localStorage.removeItem('user')
			console.warn('Unauthorized: Session cleared')
		}
		return Promise.reject(error)
	},
)

export default apiClient
