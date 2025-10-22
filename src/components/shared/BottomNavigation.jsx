import React from 'react'
import { Award, User, Info } from 'lucide-react'
import Link from 'next/link'

const BottomNavigation = ({ activeTab = 'leaderboard' }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50/90 pb-safe dark:border-gray-800 dark:bg-gray-900/90 backdrop-blur-sm">
      <nav className="flex items-center justify-around p-2">
        <Link
          href="/leaderboard"
          className={`flex flex-col items-center gap-1 p-2 px-6 ${
            activeTab === 'leaderboard'
              ? 'rounded-full bg-blue-600/10 px-4 text-blue-600 dark:bg-blue-600/20'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Award className="w-6 h-6" />
          <span className="text-xs font-medium">Leaderboard</span>
        </Link>
        <Link
          href="/my-profile"
          className={`flex flex-col items-center gap-1 p-2 px-6 ${
            activeTab === 'profile'
              ? 'rounded-full bg-blue-600/10 px-4 text-blue-600 dark:bg-blue-600/20'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
        <Link
          href="/about"
          className={`flex flex-col items-center gap-1 p-2 px-6 ${
            activeTab === 'about'
              ? 'rounded-full bg-blue-600/10 px-4 text-blue-600 dark:bg-blue-600/20'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Info className="w-6 h-6" />
          <span className="text-xs font-medium">About</span>
        </Link>
      </nav>
    </footer>
  )
}

export default BottomNavigation