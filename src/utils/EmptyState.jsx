export const EmptyState = ({ onAction }) => (
	<div className="w-full bg-white rounded-xl shadow p-8 md:p-16 flex flex-col items-center justify-center text-center animate-fade-in">
		<div className="bg-blue-50 p-6 rounded-full mb-6 border border-blue-100">
			<svg
				className="w-20 h-20 text-blue-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
				></path>
			</svg>
		</div>
		<h2 className="text-2xl font-bold text-gray-800 mb-3">No Items Found</h2>
		<p className="text-gray-500 max-w-md mb-8 text-sm md:text-base leading-relaxed">
			You haven't posted any lost or found items yet. Once you report an item, it will securely
			appear here for you to easily track and manage.
		</p>
		<button
			onClick={onAction}
			className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
		>
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M12 4v16m8-8H4"
				></path>
			</svg>
			Create New Report
		</button>
	</div>
)
