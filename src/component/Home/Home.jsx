import Footer from '../Footer/Footer'
import LatestItems from '../LatestItem/LatestItem'
import LostSomething from '../LostSomething/LostSomething'
import SimpleEffective from '../SimpleEffective/Effective'
import LoginModal from '../../Modal/LoginModal'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { getAllItems, getDashboardStats } from '../authApi/authApi'
import { toast } from 'react-toastify'

export default function Home() {
    const location = useLocation()
    const navigate = useNavigate()

    const [showLogin, setShowLogin] = useState(false)
    const [items, setItems] = useState([])
    const [loadingItems, setLoadingItems] = useState(true)

    const [dashboardStats, setDashboardStats] = useState({
        totalItems: 0,
        recoveredItems: 0,
        students: 0,
    })
    const [loadingStats, setLoadingStats] = useState(true)

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

        const fetchHomeData = async () => {
            try {
                setLoadingItems(true)
                setLoadingStats(true)

                const [itemsRes, statsRes] = await Promise.all([
                    getAllItems(),
                    getDashboardStats(),
                ])

                const fetchedItems =
                    itemsRes.data?.data?.items ||
                    itemsRes.data?.items ||
                    itemsRes.data?.data ||
                    itemsRes.data ||
                    []

                const statsData =
                    statsRes.data?.data ||
                    statsRes.data ||
                    {}

                console.log('dashboard stats response:', statsData)

                if (isMounted) {
                    setItems(Array.isArray(fetchedItems) ? fetchedItems : [])

                    setDashboardStats({
                        totalItems:
                            statsData.totalItems ??
                            statsData.itemsListed ??
                            statsData.total ??
                            statsData.itemCount ??
                            0,

                        recoveredItems:
                            statsData.recoveredItems ??
                            statsData.claimedItems ??
                            statsData.recoveredCount ??
                            statsData.foundItems ??
                            statsData.totalRecovered ??
                            0,

                        students:
                            statsData.students ??
                            statsData.totalUsers ??
                            statsData.users ??
                            statsData.studentsRegistered ??
                            statsData.totalStudents ??
                            0,
                    })
                }
            } catch (error) {
                console.error('Home data fetch failed:', error)
                if (isMounted) toast.error('Could not load dashboard data ❌')
            } finally {
                if (isMounted) {
                    setLoadingItems(false)
                    setLoadingStats(false)
                }
            }
        }

        fetchHomeData()

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

        setItems((prev) =>
            prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
        )
    }

    return (
        <>
            <LostSomething
                dashboardStats={dashboardStats}
                loading={loadingStats}
            />
            <SimpleEffective />
            <LatestItems
                items={items}
                loading={loadingItems}
                onItemUpdate={handleHomeItemUpdate}
            />
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    )
}