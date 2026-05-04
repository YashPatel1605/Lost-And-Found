import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import { ChevronDown, HelpCircle, Search, ShieldCheck, PhoneCall } from 'lucide-react'

const faqData = [
	{
		question: 'How do I report a found item?',
		answer:
			"Click on the 'Report Item' button in the navigation bar. Fill in the details including item name, description, location found, and upload an image if possible to help the owner identify it.",
	},
	{
		question: 'Is there a fee for using the platform?',
		answer:
			'No, our campus Lost & Found platform is completely free to use for all students and faculty members.',
	},
	{
		question: 'How can I prove an item belongs to me?',
		answer:
			"When you click 'Claim', you will be asked to provide specific details not mentioned in the public description, such as lock screen wallpaper, unique scratches, or contents inside a bag.",
	},
	{
		question: 'How long are items kept on the system?',
		answer:
			'Items remain listed until they are marked as claimed by the reporter. We recommend surrendering physical items to the campus security office after 48 hours.',
	},
	{
		question: 'Can I edit a report after posting it?',
		answer:
			'Yes, you can manage your reported items through your profile dashboard. From there, you can edit details or delete the post if the item is recovered.',
	},
]

function FAQItem({ item, index, openIndex, setOpenIndex }) {
	const isOpen = openIndex === index
	const buttonId = `faq-button-${index}`
	const panelId = `faq-panel-${index}`

	return (
		<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
			<h3>
				<button
					id={buttonId}
					type="button"
					aria-expanded={isOpen}
					aria-controls={panelId}
					onClick={() => setOpenIndex(isOpen ? -1 : index)}
					className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left"
				>
					<span
						className={`text-base sm:text-lg font-semibold transition-colors ${
							isOpen ? 'text-teal-700' : 'text-slate-800'
						}`}
					>
						{item.question}
					</span>

					<span
						className={`shrink-0 rounded-full p-2 transition-all ${
							isOpen ? 'bg-teal-50 text-teal-700 rotate-180' : 'bg-slate-100 text-slate-500'
						}`}
					>
						<ChevronDown className="w-5 h-5" />
					</span>
				</button>
			</h3>

			<div
				id={panelId}
				role="region"
				aria-labelledby={buttonId}
				className={`grid transition-all duration-300 ease-in-out ${
					isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
				}`}
			>
				<div className="overflow-hidden">
					<div className="px-5 pb-5 text-slate-600 leading-7 text-sm sm:text-base">
						{item.answer}
					</div>
				</div>
			</div>
		</div>
	)
}

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState(0)
	const navigate = useNavigate() // Initialize the navigate function

	// Navigation handler
	const handleContactClick = () => {
		navigate('/contact')
	}

	return (
		<section className="min-h-screen bg-slate-50 py-12 sm:py-16 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="grid gap-8 lg:grid-cols-[1.05fr_1.4fr] items-start">
					{/* Left Intro Panel */}
					<div className="lg:sticky lg:top-8 space-y-6">
						<div className="rounded-3xl bg-slate-900 text-white p-8 shadow-lg">
							<div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
								<HelpCircle className="w-7 h-7 text-teal-300" />
							</div>

							<p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-300 mb-3">
								Help Center
							</p>

							<h2 className="text-3xl sm:text-4xl font-bold leading-tight">
								Frequently asked questions
							</h2>

							<p className="mt-4 text-slate-300 leading-7">
								Everything you need to know about reporting, claiming, and managing lost-and-found
								items on campus.
							</p>

							<div className="mt-8 grid gap-4">
								<div className="rounded-2xl bg-white/5 border border-white/10 p-4">
									<div className="flex items-center gap-3 mb-2">
										<Search className="w-5 h-5 text-teal-300" />
										<p className="font-semibold">Report and search faster</p>
									</div>
									<p className="text-sm text-slate-300 leading-6">
										Include item name, location, and date for better matching.
									</p>
								</div>

								<div className="rounded-2xl bg-white/5 border border-white/10 p-4">
									<div className="flex items-center gap-3 mb-2">
										<ShieldCheck className="w-5 h-5 text-teal-300" />
										<p className="font-semibold">Safe claim verification</p>
									</div>
									<p className="text-sm text-slate-300 leading-6">
										Ownership checks help protect items from false claims.
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
							<div className="flex items-center gap-3 mb-3 text-teal-700">
								<PhoneCall className="w-5 h-5" />
								<h3 className="font-bold text-slate-900">Need direct help?</h3>
							</div>
							<p className="text-sm text-slate-600 leading-6">
								Contact campus support if your item is urgent, valuable, or already submitted to the
								security office.
							</p>
							<button
								onClick={handleContactClick}
								className="mt-5 inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
							>
								Contact Support
							</button>
						</div>
					</div>

					{/* FAQ Area */}
					<div className="space-y-5">
						<div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
							<div className="mb-6">
								<p className="text-sm font-semibold text-teal-700 uppercase tracking-[0.14em]">
									Lost & Found FAQ
								</p>
								<h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
									Answers to common questions
								</h3>
								<p className="mt-3 text-slate-600 leading-7">
									These answers cover reporting found items, proving ownership, editing reports, and
									general platform usage.
								</p>
							</div>

							<div className="space-y-4">
								{faqData.map((item, index) => (
									<FAQItem
										key={index}
										item={item}
										index={index}
										openIndex={openIndex}
										setOpenIndex={setOpenIndex}
									/>
								))}
							</div>
						</div>

						<div className="rounded-3xl bg-gradient-to-r from-teal-700 to-teal-800 p-6 sm:p-8 text-white shadow-lg">
							<h3 className="text-xl sm:text-2xl font-bold">Still have questions?</h3>
							<p className="mt-3 text-teal-50 leading-7 max-w-2xl">
								If your issue involves a disputed claim, sensitive item, or urgent recovery request,
								contact the support team with your item ID and report date.
							</p>
							<div className="mt-6">
								<button
									onClick={handleContactClick}
									className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-800 hover:bg-slate-100 transition-colors"
								>
									Contact Admin
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
