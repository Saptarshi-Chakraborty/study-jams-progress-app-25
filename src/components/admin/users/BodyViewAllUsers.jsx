import React, { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp, Edit, Trash2, Eye, RefreshCw } from 'lucide-react'
import BottomNavigation from '../../shared/BottomNavigation'
import AddNewUserDialog from './AddNewUserDialog'
import { ROLES } from '@/context/GlobalContext'

const BodyViewAllUsers = () => {
	const [sortBy, setSortBy] = useState('name')
	const [sortOrder, setSortOrder] = useState('asc')
	const [users, setUsers] = useState([])
	const [chapters, setChapters] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		fetchUsers()
		fetchChapters()
	}, [])

	async function fetchUsers() {
		const authToken = localStorage.getItem('authToken')
		const BASE_URL = process.env.NEXT_PUBLIC_API_URL
		const API = `${BASE_URL}/users/view-all`

		try {
			setLoading(true)
			const response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			})

			const result = await response.json()

			if (response.ok) {
				setUsers(result.data || [])
				setError(null)
			} else {
				setError(result.message || 'Failed to fetch users')
			}
		} catch (err) {
			setError(err.message || 'Failed to fetch users')
		} finally {
			setLoading(false)
		}
	}

	async function fetchChapters() {
        const authToken = localStorage.getItem('authToken');
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const API = `${BASE_URL}/chapters/view-all`;

        try {
            const response = await fetch(API, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const result = await response.json();
            if (response.ok) {
                setChapters(result.data || []);
            } else {
                console.error('Failed to fetch chapters:', result.message);
            }
        } catch (err) {
            console.error('Error fetching chapters:', err.message);
        }
    }

	const getRoleColor = (role) => {
		switch (role?.toLowerCase()) {
			case ROLES.ADMIN:
				return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
			case ROLES.ORGANISER:
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
			case ROLES.TEAM_MEMBER:
				return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
			default: // This includes PARTICIPANT and any other roles
				return 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
		}
	}

	const chapterMap = useMemo(() =>
        new Map(chapters.map(chapter => [chapter.id, chapter.name])),
        [chapters]
    );

	const sortedUsers = [...users].sort((a, b) => {
		const order = sortOrder === 'asc' ? 1 : -1
		if (sortBy === 'name') return order * a.name.localeCompare(b.name)
		if (sortBy === 'role') return order * a.role.localeCompare(b.role)
		if (sortBy === 'chapter') {
            const chapterA = chapterMap.get(a.chapter_id) || '';
            const chapterB = chapterMap.get(b.chapter_id) || '';
            return order * chapterA.localeCompare(chapterB);
        }
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

	const handleView = (id) => { console.log('View user:', id) }
	const handleEdit = (id) => { console.log('Edit user:', id) }
	const handleDelete = (id) => { console.log('Delete user:', id) }

	const SortIcon = ({ column }) => {
		if (sortBy !== column) return null
		return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
	}

	return (
		<div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
			<div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full h-full flex flex-col">
				<header className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
					<div className="flex items-center justify-center">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Study Jams '25</h1>
					</div>
					<h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">All Users</h2>
				</header>

				<div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
					<div className="px-4 py-4 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
						<div className="flex gap-2">
							<AddNewUserDialog onSuccess={fetchUsers} chapters={chapters} loadingChapters={loading} />
							<button onClick={() => { fetchUsers(); fetchChapters(); }} disabled={loading} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" title="Refresh users">
								<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
								<span className="hidden sm:inline">Refresh</span>
							</button>
						</div>
					</div>

					<main className="p-4 md:p-6 lg:p-8 xl:p-10">
						{loading ? (
							<div className="flex justify-center items-center py-12"><div className="text-gray-600 dark:text-gray-400">Loading users...</div></div>
						) : error ? (
							<div className="flex justify-center items-center py-12"><div className="text-red-600 dark:text-red-400">Error: {error}</div></div>
						) : users.length === 0 ? (
							<div className="flex flex-col justify-center items-center py-12 bg-white dark:bg-gray-800 rounded-lg">
								<p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No Users Found</p>
								<p className="text-gray-500 dark:text-gray-500 text-sm">Add your first user to get started</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden min-w-max">
									<thead className="bg-gray-100 dark:bg-gray-700">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => handleSort('name')}>
												<div className="flex items-center gap-2 whitespace-nowrap">User Name<SortIcon column="name" /></div>
											</th>
											<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => handleSort('role')}>
												<div className="flex items-center gap-2 whitespace-nowrap">Role<SortIcon column="role" /></div>
											</th>
											<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => handleSort('chapter')}>
												<div className="flex items-center gap-2 whitespace-nowrap">Chapter<SortIcon column="chapter" /></div>
											</th>
											<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
										{sortedUsers.map((user) => (
											<tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
												<td className="px-4 py-4">
													<div className="min-w-[250px]">
														<p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
														<p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
													</div>
												</td>
												<td className="px-4 py-4 whitespace-nowrap">
													<span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
														{user.role.replace('_', ' ')}
													</span>
												</td>
												<td className="px-4 py-4 whitespace-nowrap">
													<span className="text-sm text-gray-900 dark:text-gray-100">
														{chapterMap.get(user.chapter_id) || 'N/A'}
													</span>
												</td>
												<td className="px-4 py-4 whitespace-nowrap">
													<div className="flex items-center gap-2">
														<button onClick={() => handleView(user.id)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button>
														<button onClick={() => handleEdit(user.id)} className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
														<button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</main>
				</div>

				<BottomNavigation activeTab="users" />
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

export default BodyViewAllUsers