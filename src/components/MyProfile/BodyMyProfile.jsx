import React from 'react'
import { Trophy, FlaskConical, Users } from 'lucide-react'
import { PROFILE_DATA } from './data'
import BottomNavigation from '../shared/BottomNavigation'

const BodyMyProfile = () => {
  const getActivityIcon = (iconName) => {
    const iconMap = {
      'emoji_events': Trophy,
      'science': FlaskConical,
      'group': Users
    }
    const IconComponent = iconMap[iconName] || Trophy
    return <IconComponent className="w-3 h-3" />
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
      <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <header className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Study Jams '25</h1>
          </div>
          <h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">Profile</h2>
        </header>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {/* Main Content */}
          <main className="p-4 md:p-6 lg:p-8 xl:p-10">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    alt={`${PROFILE_DATA.name}'s profile picture`}
                    className="h-32 w-32 rounded-full object-cover"
                    src={PROFILE_DATA.image}
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                    #{PROFILE_DATA.rank}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {PROFILE_DATA.name}
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {PROFILE_DATA.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <section className="mt-8">
              <h2 className="px-2 pb-2 text-lg font-bold text-gray-900 dark:text-white">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 p-2">
                {PROFILE_DATA.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="cursor-pointer rounded-full bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-600/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Progress Section */}
            <section className="mt-6">
              <h2 className="px-2 pb-2 text-lg font-bold text-gray-900 dark:text-white">
                Progress
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Quests Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {PROFILE_DATA.progress.questsCompleted}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Labs Finished
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {PROFILE_DATA.progress.labsFinished}
                  </p>
                </div>
                <div className="col-span-2 rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Last Lab Completion
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {PROFILE_DATA.progress.lastLabCompletion}
                  </p>
                </div>
              </div>
            </section>

            {/* Activity Feed Section */}
            <section className="mt-8">
              <h2 className="px-2 pb-2 text-lg font-bold text-gray-900 dark:text-white">
                Activity Feed
              </h2>
              <div className="relative flex flex-col pl-6">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                {PROFILE_DATA.activityFeed.map((activity, index) => (
                  <div key={index} className="relative flex items-start gap-4 pb-8">
                    <div className="absolute left-0 top-3 -ml-[11.5px] flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        {getActivityIcon(activity.icon)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        {/* Footer Navigation */}
        <BottomNavigation activeTab="profile" />
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

export default BodyMyProfile