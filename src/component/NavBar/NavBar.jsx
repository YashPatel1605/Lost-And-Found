import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import LoginModal from '../../Modal/LoginModal'

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [openLoginModal, setOpenLoginModal] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [user, setUser] = useState(null)

	const activeClass = 'bg-blue-900 text-blue-300 px-4 py-2 rounded-lg'
	const linkClass = 'px-4 py-2 text-gray-300 hover:text-white transition duration-200'

	const mobileLinkClass = ({ isActive }) =>
		isActive ? 'text-blue-400 font-semibold' : 'text-white hover:text-blue-400 transition'

	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem('token')
			const userData = localStorage.getItem('user')

			if (userData) {
				setUser(JSON.parse(userData))
			}

			setIsLoggedIn(!!token)
		}

		checkAuth()

		window.addEventListener('authChange', checkAuth)

		return () => window.removeEventListener('authChange', checkAuth)
	}, [])

	const getInitial = (name) => {
		return name ? name.charAt(0).toUpperCase() : ''
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')

		window.dispatchEvent(new Event('authChange'))
		setIsLoggedIn(false)
		setIsOpen(false)
	}
	const handleLinkClick = () => {
		setIsOpen(false)
	}

	return (
		<>
			{/* NAVBAR */}
			<nav className="sticky top-0 z-30 bg-[#0f1c2e] text-white shadow-md">
				<div className="flex items-center justify-between px-4 sm:px-6 py-3">
					{/* Logo */}
					<h1 className="text-xl font-bold">
						Campus <span className="text-blue-400">Find</span>
					</h1>

					{/* Desktop Links */}
					<div className="hidden md:flex items-center gap-2">
						<NavLink to="/" className={({ isActive }) => (isActive ? activeClass : linkClass)}>
							Home
						</NavLink>
						<NavLink
							to="/browse"
							className={({ isActive }) => (isActive ? activeClass : linkClass)}
						>
							Browse
						</NavLink>
						<NavLink
							to="/report"
							className={({ isActive }) => (isActive ? activeClass : linkClass)}
						>
							Report
						</NavLink>
						<NavLink
							to="/mypost"
							className={({ isActive }) => (isActive ? activeClass : linkClass)}
						>
							Dashboard
						</NavLink>
					</div>

					{/* Desktop Auth */}
					<div className="hidden md:flex items-center gap-3">
						{isLoggedIn && user ? (
							<div className="flex items-center gap-3">
								{/* Avatar */}
								<div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer">
									{getInitial(user.name)}
								</div>

								{/* User Info */}
								<div className="flex flex-col text-sm cursor-pointer">
									<span className="font-semibold">{user.name}</span>
									<span className="text-gray-300 text-xs">{user.email}</span>
								</div>

								{/* Logout */}
								<button
									onClick={handleLogout}
									className="border border-red-400 px-3 py-1 rounded-lg hover:bg-red-600 text-sm cursor-pointer"
								>
									Logout
								</button>
							</div>
						) : (
							<>
								<button
									onClick={() => setOpenLoginModal(true)}
									className="border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
								>
									Log In
								</button>
								<button
									onClick={() => setOpenLoginModal(true)}
									className="border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
								>
									Sign Up
								</button>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button onClick={() => setIsOpen(true)} className="md:hidden text-2xl">
						☰
					</button>
				</div>
			</nav>

			{/* 🔥 Overlay */}
			{isOpen && (
				<div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
			)}

			{/* 🔥 Mobile Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-64 bg-[#0f1c2e] z-50 p-5 flex flex-col transform transition-transform duration-300 ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				{/* Close */}
				<button
					onClick={() => setIsOpen(false)}
					className="absolute top-4 right-4 text-xl text-white mb-40"
				>
					✕
				</button>

				{/* Links (Dashboard Added Here) */}
				<div className="flex flex-col gap-4 text-lg">
					<NavLink to="/" onClick={handleLinkClick} className={mobileLinkClass}>
						Home
					</NavLink>
					<NavLink to="/browse" onClick={handleLinkClick} className={mobileLinkClass}>
						Browse
					</NavLink>
					<NavLink to="/report" onClick={handleLinkClick} className={mobileLinkClass}>
						Report
					</NavLink>
					{/* ✅ Dashboard added for Mobile View */}
					<NavLink to="/mypost" onClick={handleLinkClick} className={mobileLinkClass}>
						Dashboard
					</NavLink>
				</div>

				{/* Auth */}
				<div className="mt-auto flex flex-col gap-3 pt-6">
					{isLoggedIn ? (
						<button
							onClick={handleLogout}
							className="w-full py-2 border border-red-500 text-white rounded-lg hover:bg-red-600 transition"
						>
							Logout
						</button>
					) : (
						<>
							<button
								onClick={() => {
									setOpenLoginModal(true)
									setIsOpen(false)
								}}
								className="w-full py-2 border border-gray-400 text-white rounded-lg hover:bg-gray-700 transition cursor-pointer"
							>
								Log In
							</button>
							<button
								onClick={() => {
									setOpenLoginModal(true)
									setIsOpen(false)
								}}
								className="w-full py-2 border border-gray-400 text-white rounded-lg hover:bg-gray-700 transition cursor-pointer"
							>
								Sign Up
							</button>
						</>
					)}
				</div>
			</div>

			{/* Modal */}
			<LoginModal
				isOpen={openLoginModal}
				onClose={() => setOpenLoginModal(false)}
				onLoginSuccess={() => setIsLoggedIn(true)}
			/>
		</>
	)
}

export default Navbar
