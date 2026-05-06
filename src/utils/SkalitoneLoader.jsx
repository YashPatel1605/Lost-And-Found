export const TableRowSkeleton = () => (
	<tr className="border-t animate-pulse">
		<td className="p-4">
			<div className="flex items-center gap-3 min-w-0">
				<div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
				<div className="h-4 bg-gray-200 rounded w-24"></div>
			</div>
		</td>
		<td className="p-4">
			<div className="h-4 bg-gray-200 rounded w-16"></div>
		</td>
		<td className="p-4">
			<div className="h-4 bg-gray-200 rounded w-20"></div>
		</td>
		<td className="p-4">
			<div className="h-6 bg-gray-200 rounded-full w-16"></div>
		</td>
		<td className="p-4">
			<div className="flex justify-center gap-2 flex-wrap">
				<div className="h-8 bg-gray-200 rounded w-24"></div>
				<div className="h-8 bg-gray-200 rounded w-12"></div>
				<div className="h-8 bg-gray-200 rounded w-12"></div>
			</div>
		</td>
	</tr>
)

export const MobileCardSkeleton = () => (
	<div className="bg-white rounded-xl shadow p-4 space-y-3 animate-pulse">
		<div className="flex items-center gap-3">
			<div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
			<div className="h-4 bg-gray-200 rounded w-1/2"></div>
		</div>
		<div className="grid grid-cols-2 gap-3">
			<div className="h-3 bg-gray-100 rounded w-10"></div>
			<div className="h-3 bg-gray-200 rounded w-16 justify-self-end"></div>
			<div className="h-3 bg-gray-100 rounded w-10"></div>
			<div className="h-3 bg-gray-200 rounded w-16 justify-self-end"></div>
		</div>
		<div className="grid grid-cols-2 gap-2 pt-2">
			<div className="h-9 bg-gray-200 rounded-md"></div>
			<div className="h-9 bg-gray-200 rounded-md"></div>
		</div>
	</div>
)
