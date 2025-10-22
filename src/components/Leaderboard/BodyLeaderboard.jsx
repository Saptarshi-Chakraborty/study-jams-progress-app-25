import React, { useState } from 'react'
import { ArrowLeft, ArrowDown } from 'lucide-react'
import { LEADERBOARD_DATA, TOP_THREE_DATA } from './data'
import BottomNavigation from '../shared/BottomNavigation'

const BodyLeaderboard = () => {
    const [timeFilter, setTimeFilter] = useState('all-time')
    const [sortBy, setSortBy] = useState('rank')

    const topThree = [...TOP_THREE_DATA]
    const leaderboardData = [...LEADERBOARD_DATA]

    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
            <div className="max-w-md mx-auto w-full h-full flex flex-col">
                {/* Header */}
                <header className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center justify-center">

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Study Jams '25</h1>

                    </div>
                    <h2 className="text-l font-bold text-center mt-1 text-gray-900 dark:text-gray-100">GDG on Campus</h2>
                </header>

                {/* Top 3 Podium - Fixed */}
                <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-end justify-center pt-8 pb-4 gap-4 text-center">
                        {topThree.map((person) => (
                            <div key={person.rank} className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        alt={person.name}
                                        className={`${person.size} rounded-full border-4 ${person.border} object-cover`}
                                        src={person.image}
                                    />
                                    <div
                                        className={`absolute -bottom-2 -right-2 ${person.badge} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm`}
                                    >
                                        {person.rank}
                                    </div>
                                </div>
                                <p className={`font-bold mt-2 ${person.rank !== 1 ? 'text-sm' : ''} text-gray-900 dark:text-gray-100`}>
                                    {person.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {person.points} pts
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto pb-20">
                    {/* Filters */}
                    <div className="px-4 py-4 space-y-2 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                        {/* Time Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setTimeFilter('all-time')}
                                className={`px-4 py-1.5 text-sm rounded-full font-medium whitespace-nowrap ${timeFilter === 'all-time'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    }`}
                            >
                                All-Time
                            </button>
                            <button
                                onClick={() => setTimeFilter('weekly')}
                                className={`px-4 py-1.5 text-sm rounded-full font-medium whitespace-nowrap ${timeFilter === 'weekly'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    }`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setTimeFilter('monthly')}
                                className={`px-4 py-1.5 text-sm rounded-full font-medium whitespace-nowrap ${timeFilter === 'monthly'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    }`}
                            >
                                Monthly
                            </button>
                        </div>

                        {/* Sort Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSortBy('rank')}
                                className="px-4 py-1.5 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 whitespace-nowrap"
                            >
                                Rank <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setSortBy('name')}
                                className="px-4 py-1.5 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap"
                            >
                                Name
                            </button>
                            <button
                                onClick={() => setSortBy('completion')}
                                className="px-4 py-1.5 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                                Completion
                            </button>
                        </div>
                    </div>

                    {/* Leaderboard List */}
                    <div className="px-2 pb-4 space-y-2">
                        {leaderboardData.map((participant) => (
                            <div
                                key={participant.rank}
                                className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg mb-0"
                            >
                                <p className="font-bold w-6 text-center text-gray-500 dark:text-gray-400">
                                    {participant.rank}
                                </p>
                                <img
                                    alt={participant.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={participant.image}
                                />
                                <div className="flex-grow">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {participant.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {participant.quests}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="font-bold text-blue-600">{participant.points}</p>
                                    <div className="w-20 h-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-1">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${participant.completion}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Navigation */}
                <BottomNavigation activeTab="leaderboard" />
            </div>
        </div>
    )
}

export default BodyLeaderboard