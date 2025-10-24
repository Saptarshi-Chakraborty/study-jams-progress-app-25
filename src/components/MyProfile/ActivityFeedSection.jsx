import React from 'react'
import { PROFILE_DATA } from './data'

const ActivityFeedSection = () => {
    return (
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
    )
}

export default ActivityFeedSection