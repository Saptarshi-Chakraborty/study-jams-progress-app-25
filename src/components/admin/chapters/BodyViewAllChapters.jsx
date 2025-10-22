import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Edit, Trash2, Eye } from 'lucide-react'
import BottomNavigation from '../../shared/BottomNavigation'
import AddNewChapterDialog from './AddNewChapterDialog'

// Sample chapter data - replace with actual data fetching
const CHAPTERS_DATA = [
	{
		id: 1,
		name: 'Google Cloud Essentials',
		description: 'Introduction to Google Cloud Platform fundamentals',
		status: 'Active',
		enrolledCount: 245,
	},
	{
		id: 2,
		name: 'Generative AI Fundamentals',
		description: 'Learn the basics of Generative AI and its applications',
		status: 'Active',
		enrolledCount: 189,
	},
	{
		id: 3,
		name: 'Cloud Architecture',
		description: 'Design and implement scalable cloud solutions',
		status: 'Active',
		enrolledCount: 132,
	},
	{
		id: 4,
		name: 'Data Engineering',
		description: 'Build and maintain data pipelines on Google Cloud',
		status: 'Inactive',
		enrolledCount: 0,
	},
	{
		id: 5,
		name: 'Machine Learning on GCP',
		description: 'Deploy ML models using Google Cloud services',
		status: 'Active',
		enrolledCount: 167,
	},
]

const BodyViewAllChapters = () => {
	const [sortBy, setSortBy] = useState('name')
	const [sortOrder, setSortOrder] = useState('asc')

	const getStatusColor = (status) => {
		switch (status) {
			case 'Active':
				return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
			case 'Inactive':
				return 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
			default:
				return 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
		}
	}

	const sortedChapters = [...CHAPTERS_DATA].sort((a, b) => {
		const order = sortOrder === 'asc' ? 1 : -1
		if (sortBy === 'name') return order * a.name.localeCompare(b.name)
		if (sortBy === 'enrolled') return order * (a.enrolledCount - b.enrolledCount)
		return 0
	})

	const handleSort = (column) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(column)
			setSortOrder('asc')
		}
	}

	const handleView = (id) => {
		console.log('View chapter:', id)
	}

	const handleEdit = (id) => {
		console.log('Edit chapter:', id)
	}

	const handleDelete = (id) => {
		console.log('Delete chapter:', id)
	}

	const SortIcon = ({ column }) => {
		if (sortBy !== column) return null
		return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
	}

	return (
		<div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
			<div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full h-full flex flex-col">
				{/* Header */}
				<header className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
					<div className="flex items-center justify-center">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">
							Study Jams '25
						</h1>
					</div>
					<h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">
						All Chapters
					</h2>
				</header>

				{/* Scrollable Section */}
				<div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
					{/* Add Chapter Button Section */}
					<div className="px-4 py-4 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
						<AddNewChapterDialog />
					</div>

					{/* Main Content */}
					<main className="p-4 md:p-6 lg:p-8 xl:p-10">
						{/* Horizontally Scrollable Table */}
						<div className="overflow-x-auto">
							<table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden min-w-max">
								<thead className="bg-gray-100 dark:bg-gray-700">
									<tr>
										<th
											className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
											onClick={() => handleSort('name')}
										>
											<div className="flex items-center gap-2 whitespace-nowrap">
												Chapter Name
												<SortIcon column="name" />
											</div>
										</th>
										<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
											Status
										</th>
										<th
											className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
											onClick={() => handleSort('enrolled')}
										>
											<div className="flex items-center gap-2 whitespace-nowrap">
												Enrolled
												<SortIcon column="enrolled" />
											</div>
										</th>
										<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
									{sortedChapters.map((chapter) => (
										<tr key={chapter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
											<td className="px-4 py-4">
												<div className="min-w-[250px]">
													<p className="font-medium text-gray-900 dark:text-gray-100">
														{chapter.name}
													</p>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														{chapter.description}
													</p>
												</div>
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
														chapter.status
													)}`}
												>
													{chapter.status}
												</span>
											</td>
											<td className="px-4 py-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
												{chapter.enrolledCount}
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<button
														onClick={() => handleView(chapter.id)}
														className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
														title="View"
													>
														<Eye className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleEdit(chapter.id)}
														className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
														title="Edit"
													>
														<Edit className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDelete(chapter.id)}
														className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
														title="Delete"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</main>
				</div>

				{/* Footer Navigation */}
				<BottomNavigation activeTab="chapters" />
			</div>

			<style jsx>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	)
}

export default BodyViewAllChapters