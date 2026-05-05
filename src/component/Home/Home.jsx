import Footer from '../Footer/Footer'
import LatestItems from '../LatestItem/LatestItem'
import LostSomething from '../LostSomething/LostSomething'
import SimpleEffective from '../SimpleEffective/Effective'
import LoginModal from '../../Modal/LoginModal'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { getAllItems } from '../authApi/authApi'
import { toast } from 'react-toastify'

export default function Home() {
	const location = useLocation()
	const navigate = useNavigate()

	const [showLogin, setShowLogin] = useState(false)
	const [items, setItems] = useState([])
	const [loadingItems, setLoadingItems] = useState(true)

	const fetchedRef = useRef(false)

	useEffect(() => {
		if (location.state?.from) {
			setShowLogin(true)
		}
	}, [location.state?.from])

	useEffect(() => {
		if (fetchedRef.current) return
		fetchedRef.current = true

		let isMounted = true

		const fetchHomeItems = async () => {
			try {
				setLoadingItems(true)

				const res = await getAllItems()
				const fetchedData =
					res.data?.data?.items || res.data?.items || res.data?.data || res.data || []

				if (isMounted) {
					setItems(Array.isArray(fetchedData) ? fetchedData : [])
				}
			} catch (error) {
				console.error('Home items fetch failed:', error)
				if (isMounted) toast.error('Could not load items ❌')
			} finally {
				if (isMounted) setLoadingItems(false)
			}
		}

		fetchHomeItems()

		return () => {
			isMounted = false
		}
	}, [])

	const handleLoginSuccess = () => {
		setShowLogin(false)
		const destination = location.state?.from || '/mypost'
		navigate(destination)
		window.history.replaceState({}, document.title)
	}

	const handleHomeItemUpdate = (updatedItem) => {
		if (!updatedItem?._id) return

		setItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
	}

	return (
		<>
			<LostSomething items={items} loading={loadingItems} />
			<SimpleEffective />
			<LatestItems items={items} loading={loadingItems} onItemUpdate={handleHomeItemUpdate} />

			<LoginModal
				isOpen={showLogin}
				onClose={() => setShowLogin(false)}
				onLoginSuccess={handleLoginSuccess}
			/>
		</>
	)
}
