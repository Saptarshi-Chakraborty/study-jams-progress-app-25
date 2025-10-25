import React, { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronUp, Edit, Trash2, Eye, RefreshCw } from 'lucide-react'
import BottomNavigation from '../../shared/BottomNavigation'
import AddNewTeamMemberDialog from './AddNewTeamMemberDialog'
import EditTeamMemberDialog from './EditTeamMemberDialog'
import { ROLES } from '@/context/GlobalContext'

const BodyMyTeamMembers = () => {
	const [sortBy, setSortBy] = useState('name')
	const [sortOrder, setSortOrder] = useState('asc')
	const [users, setUsers] = useState([])
	const [currentUser, setCurrentUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [selectedMember, setSelectedMember] = useState(null)

	const fetchData = useCallback(async () => {
		setLoading(true)
		setError(null)
		const authToken = localStorage.getItem('authToken')
		const BASE_URL = process.env.NEXT_PUBLIC_API_URL

		try {
			// Fetch current user
			const userResponse = await fetch(`${BASE_URL}/auth/me`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
			})
			const userData = await userResponse.json()
			if (!userResponse.ok) throw new Error(userData.message || 'Failed to fetch your user details.')
			
			// The user object might be at the root of the response, or nested in a 'data' property.
			const userObject = userData.data || userData
			if (!userObject) {
				throw new Error('Invalid user data from server.')
			}
			setCurrentUser(userObject)

			// Fetch team members
			const membersResponse = await fetch(`${BASE_URL}/team-members/view-all`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
			})
			const membersData = await membersResponse.json()
			if (!membersResponse.ok) throw new Error(membersData.message || 'Failed to fetch team members.')
			setUsers(membersData.data || [])
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const getRoleColor = (role) => {
		switch (role?.toLowerCase()) {
            case ROLES.ADMIN:
                return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
			case ROLES.ORGANISER:
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
			case ROLES.TEAM_MEMBER:
				return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
			default:
				return 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
		}
	}

	const sortedUsers = [...users].sort((a, b) => {
		const order = sortOrder === 'asc' ? 1 : -1
		if (sortBy === 'name') return order * a.name.localeCompare(b.name)
		if (sortBy === 'role') return order * a.role.localeCompare(b.role)
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
	
	const handleEdit = (id) => {
		const member = users.find(u => u.id === id)
		if (member) {
			setSelectedMember(member)
			setEditDialogOpen(true)
		}
	}
	
	const handleDelete = async (id) => {
		const member = users.find(u => u.id === id)
		if (!member) return

		const confirmed = window.confirm(`Are you sure you want to delete ${member.name}? This action cannot be undone.`)
		if (!confirmed) return

		const authToken = localStorage.getItem('authToken')
		const BASE_URL = process.env.NEXT_PUBLIC_API_URL
		const API = `${BASE_URL}/team-members/delete`

		try {
			const response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authToken}`,
				},
				body: JSON.stringify({ id }),
			})

			const data = await response.json()

			if (response.ok) {
				alert('Team member deleted successfully!')
				fetchData()
			} else {
				alert(`Error: ${data.message || 'Failed to delete team member.'}`)
			}
		} catch (err) {
			alert(`Error: ${err.message || 'Failed to delete team member.'}`)
		}
	}

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
					<h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">My Team Members</h2>
					{currentUser && <h3 className="text-md font-medium text-center text-gray-600 dark:text-gray-400">{currentUser.chapter_name}</h3>}
				</header>

				<div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
					<div className="px-4 py-4 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
						<div className="flex gap-2">
							<AddNewTeamMemberDialog onSuccess={fetchData} currentUser={currentUser} />
							<button onClick={fetchData} disabled={loading} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" title="Refresh users">
								<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
								<span className="hidden sm:inline">Refresh</span>
							</button>
						</div>
					</div>

					<main className="p-4 md:p-6 lg:p-8 xl:p-10">
						{loading ? (
							<div className="flex justify-center items-center py-12"><div className="text-gray-600 dark:text-gray-400">Loading team members...</div></div>
						) : error ? (
							<div className="flex justify-center items-center py-12"><div className="text-red-600 dark:text-red-400">Error: {error}</div></div>
						) : users.length === 0 ? (
							<div className="flex flex-col justify-center items-center py-12 bg-white dark:bg-gray-800 rounded-lg">
								<p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No Team Members Found</p>
								<p className="text-gray-500 dark:text-gray-500 text-sm">Use the 'Add New Team Member' button above to get started.</p>
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

				<BottomNavigation activeTab="team" />
			</div>

			<EditTeamMemberDialog 
				open={editDialogOpen} 
				onOpenChange={setEditDialogOpen} 
				member={selectedMember}
				onSuccess={fetchData}
			/>

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

export default BodyMyTeamMembers