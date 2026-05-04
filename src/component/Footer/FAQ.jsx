import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

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
			"When you click 'Claim', you will be asked to provide specific details not mentioned in the public description (e.g., lock screen wallpaper, unique scratches, or contents inside a bag).",
	},
	{
		question: 'How long are items kept on the system?',
		answer:
			"Items remain listed until they are marked as 'Claimed' by the reporter. However, we recommend surrendering physical items to the campus security office after 48 hours.",
	},
	{
		question: 'Can I edit a report after posting it?',
		answer:
			'Yes, you can manage your reported items through your Profile dashboard. From there, you can edit details or delete the post if the item is recovered.',
	},
]

const FAQItem = ({ question, answer, isOpen, onClick }) => {
	return (
		<div className="border-b border-gray-200">
			<button
				className="w-full py-5 flex justify-between items-center text-left focus:outline-none group"
				onClick={onClick}
			>
				<span
					className={`text-lg font-medium transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-500'}`}
				>
					{question}
				</span>
				{isOpen ? (
					<ChevronUp className="text-blue-600 w-5 h-5" />
				) : (
					<ChevronDown className="text-gray-400 w-5 h-5" />
				)}
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? 'max-h-48 opacity-100 mb-5' : 'max-h-0 opacity-0'
				}`}
			>
				<p className="text-gray-600 leading-relaxed">{answer}</p>
			</div>
		</div>
	)
}

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState(0)

	return (
		<section className="py-16 bg-gray-50 min-h-screen">
			<div className="max-w-3xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
						<HelpCircle className="text-blue-600 w-6 h-6" />
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
						Frequently Asked Questions
					</h2>
					<p className="mt-4 text-gray-600">
						Everything you need to know about the Lost & Found process.
					</p>
				</div>

				{/* Accordion Container */}
				<div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
					{faqData.map((item, index) => (
						<FAQItem
							key={index}
							question={item.question}
							answer={item.answer}
							isOpen={openIndex === index}
							onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
						/>
					))}
				</div>

				{/* Contact CTA */}
				<div className="mt-12 text-center p-8 bg-blue-600 rounded-2xl shadow-lg">
					<h3 className="text-white font-bold text-xl">Still have questions?</h3>
					<p className="text-blue-100 mt-2">We're here to help you find your belongings.</p>
					<button className="mt-6 px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
						Contact Support
					</button>
				</div>
			</div>
		</section>
	)
}
