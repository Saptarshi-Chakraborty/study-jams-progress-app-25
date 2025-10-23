"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2, Eye, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BottomNavigation from '../shared/BottomNavigation';

const BodyParticipants = () => {
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [participants, setParticipants] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // If there's a search term, let the search effect handle it.
        if (!searchTerm) {
            fetchParticipants(currentPage);
        }
    }, [currentPage, searchTerm]); // Re-fetch if searchTerm is cleared

    // Effect for handling search with debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm && searchTerm.length >= 3) {
                setCurrentPage(1); // Reset to page 1 for new search
                handleSearch(searchTerm);
            } else {
                // If search term is cleared or less than 3 chars, fetch the first page of all participants
                if (participants.length > 0 || error) { // Avoid initial double fetch
                    setCurrentPage(1);
                    fetchParticipants(1);
                }
            }
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    async function fetchParticipants(page = 1) {
        const authToken = localStorage.getItem('authToken');
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        // The endpoint for fetching all participants with pagination
        const API_PAGINATED = `${BASE_URL}/participants/my-chapter`;

        try {
            setLoading(true);
            const response = await fetch(API_PAGINATED, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    page: page,
                    limit: 15
                })
            });

            const result = await response.json();

            if (response.ok) {
                setPaginationInfo(result.pagination);
                setParticipants(result.data || []);
                setError(null);
            } else {
                setError(result.message || 'Failed to fetch participants');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch participants');
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(query) {
        const authToken = localStorage.getItem('authToken');
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        // The endpoint for searching participants
        const API_SEARCH = `${BASE_URL}/participants/search`;

        try {
            setLoading(true);
            // The search endpoint is a GET request
            const response = await fetch(API_SEARCH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({searchTerm: query})
            });

            const result = await response.json();

            if (response.ok) {
                // Search returns all results, so no pagination info
                setPaginationInfo(null);
                setParticipants(result.data || []);
                setError(null);
            } else {
                setError(result.message || 'Failed to search participants');
            }
        } catch (err) {
            setError(err.message || 'Failed to search participants');
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
            case 'active':
                return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            case 'Inactive':
            case 'inactive':
                return 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400';
            default:
                return 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400';
        }
    };

    // Client-side filtering and sorting is removed as pagination is handled by the server.
    // For a full implementation, search and sort would trigger API refetches.
    // const filteredParticipants = participants.filter(participant =>
    //     participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     participant.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    //     const order = sortOrder === 'asc' ? 1 : -1;
    //     if (sortBy === 'name') return order * a.name.localeCompare(b.name);
    //     if (sortBy === 'enrolledOn') return order * (new Date(a.enrolledOn) - new Date(b.enrolledOn));
    //     return 0;
    // });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        // In a server-side sort implementation, you would refetch data here.
    };

    const handleView = (id) => {
        console.log('View participant:', id);
    };

    const handleEdit = (id) => {
        console.log('Edit participant:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete participant:', id);
    };

    const SortIcon = ({ column }) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    const handleRefresh = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchParticipants(1);
        }
    };

    const sortedParticipants = participants; // Using participants directly for now

    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
            <div className="max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full h-full flex flex-col">
                {/* Header */}
                <header className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">
                            Study Jams '25
                        </h1>
                    </div>
                    <h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">
                        All Participants
                    </h2>
                </header>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                    {/* Search and Refresh Section */}
                    <div className="px-4 py-4 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="search"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                title="Refresh participants"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="p-4 md:p-6 lg:p-8 xl:p-10">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-gray-600 dark:text-gray-400">Loading participants...</div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-red-600 dark:text-red-400">Error: {error}</div>
                            </div>
                        ) : sortedParticipants.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                                    {searchTerm ? 'No participants match your search' : 'No Participants Found'}
                                </p>
                                {!searchTerm && (
                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                                        Participants will appear here once they are registered.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden min-w-max">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                    Participant Name
                                                    <SortIcon column="name" />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                                Status
                                            </th>
                                            <th
                                                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                                onClick={() => handleSort('enrolledOn')}
                                            >
                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                    Enrolled On
                                                    <SortIcon column="enrolledOn" />
                                                </div>
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                                Actions
                                            </th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
										{sortedParticipants.map((participant) => (
											<tr
												key={participant.id}
												className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
											>
												<td className="px-4 py-4">
													<div className="min-w-[200px]">
														<p className="font-medium text-gray-900 dark:text-gray-100">
															{participant.name}
														</p>
													</div>
												</td>
                                                <td className="px-4 py-4">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {participant.email}
                                                    </p>
                                                </td>
												<td className="px-4 py-4 whitespace-nowrap">
													<span
														className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
															participant.status
														)}`}
													>
														{participant.status}
													</span>
												</td>
												<td className="px-4 py-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
													{new Date(participant.enrolledOn).toLocaleDateString()}
												</td>
												<td className="px-4 py-4 whitespace-nowrap">
													<div className="flex items-center gap-2">
														<button
															onClick={() => handleView(participant.id)}
															className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
															title="View"
														>
															<Eye className="w-4 h-4" />
														</button>
														<button
															onClick={() => handleEdit(participant.id)}
															className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
															title="Edit"
														>
															<Edit className="w-4 h-4" />
														</button>
														<button
															onClick={() => handleDelete(participant.id)}
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
                        )}

                        {/* Pagination Controls */}
                        {paginationInfo && paginationInfo.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 px-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1 || loading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <span className="text-sm text-gray-700 dark:text-gray-400">
                                    Page{' '}
                                    <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span>
                                    {' '}of{' '}
                                    <span className="font-semibold text-gray-900 dark:text-white">{paginationInfo.totalPages}</span>
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationInfo.totalPages))}
                                    disabled={currentPage === paginationInfo.totalPages || loading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
					</main>
				</div>

                {/* Footer Navigation */}
                <BottomNavigation activeTab="participants" />
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
    );
};

export default BodyParticipants;