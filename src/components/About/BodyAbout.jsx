import React from 'react'
import BottomNavigation from '../shared/BottomNavigation'

const BodyAbout = () => {
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
            About
          </h2>
        </header>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {/* Main Content */}
          <main className="space-y-6 p-4 md:p-6 lg:p-8 xl:p-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                GDG on Campus
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                GDG on Campus is a university-based chapter of the global Google
                Developer Groups (GDG) community. We aim to foster a vibrant
                community of student developers, providing resources, workshops,
                and events to enhance their skills in Google technologies and
                beyond.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Study Jams
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Study Jams are focused, hands-on learning sessions designed to
                help you master specific technologies. This year, we're diving
                into Google Cloud and Generative AI, offering a structured path
                to gain practical experience and build real-world projects.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Benefits
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Participating in Study Jams offers numerous advantages:
                structured learning paths, hands-on labs, mentorship from
                experienced developers, and the opportunity to collaborate with
                peers. Plus, you'll earn certificates and badges to showcase
                your achievements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Rules &amp; Scoring
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Points are awarded for completing labs and projects. Active
                participation in discussions and events also earns points. The
                leaderboard tracks progress, and top performers receive
                recognition and prizes. Detailed scoring breakdowns are
                available in the FAQ section.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Contact
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                For questions or support, reach out to us at{' '}
                <a
                  className="font-medium text-blue-600 hover:underline"
                  href="mailto:gdgocsupport@google.com"
                >
                  gdgocsupport@google.com
                </a>
                {' '}or connect with us on social media. We're here to help you
                succeed!
              </p>
            </section>
          </main>
        </div>

        {/* Footer Navigation */}
        <BottomNavigation activeTab="about" />
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

export default BodyAbout