"use client"

import React, { useState } from 'react'
import BottomNavigation from '../shared/BottomNavigation'

const BodyLeaderboard = ({ initialData = [] }) => {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredLeaderboard = initialData.filter(participant =>
        participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankRowClass = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-100 dark:bg-yellow-500/20';
            case 2:
                return 'bg-gray-200 dark:bg-gray-700/50';
            case 3:
                return 'bg-orange-100 dark:bg-orange-500/20';
            default:
                return 'bg-gray-50 dark:bg-gray-900';
        }
    };

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

                {/* Search Bar */}
                <div className="px-4 pb-2 pt-2 bg-gray-50 dark:bg-gray-900">
                    <input
                        type="text"
                        placeholder="> search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-none font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                    <div className="px-2 pt-2 pb-4 space-y-2">
                        {filteredLeaderboard.length > 0 ? (
                            filteredLeaderboard.map((participant) => (
                                <div
                                    key={participant.rank}
                                    className={`flex items-center gap-4 p-2 rounded-lg mb-0 ${getRankRowClass(participant.rank)}`}
                                >
                                    {/* <p className="font-bold w-6 text-center text-gray-500 dark:text-gray-400">
                                        {participant.rank}
                                    </p> */}
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
                                            {participant.quests}/20 Labs Completed
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="font-bold text-blue-600">{participant.completion}%</p>
                                        <div className="w-20 h-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-1">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${participant.completion}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 pt-4">No participants found.</p>
                        )}
                    </div>
                </div>

                {/* Footer Navigation */}
                <BottomNavigation activeTab="leaderboard" />
            </div>
        </div>
    )
}

export default BodyLeaderboard