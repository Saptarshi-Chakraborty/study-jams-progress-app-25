"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Trophy, FlaskConical, Users, ExternalLink, Loader2, Award, Gamepad2, CheckCircle2, XCircle, LogOut } from 'lucide-react'
// import Confetti from 'react-confetti'; // Removed for dynamic import
import { PROFILE_DATA } from './data'
import BottomNavigation from '../shared/BottomNavigation'
import { SKILL_BADGES as skillBadges, ARCADE_GAMES as arcadeGames } from '../../data/SYLLABUS'
import ActivityFeedSection from './ActivityFeedSection'
import { useGlobalContext } from '../../context/GlobalContext'

// The useWindowSize hook is no longer needed here as we'll get dimensions on demand.

const BodyMyProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useGlobalContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const [recycleConfetti, setRecycleConfetti] = useState(true);
  const [ConfettiComponent, setConfettiComponent] = useState(null);
  const [confettiProps, setConfettiProps] = useState({ width: 0, height: 0 });

  const completedSkillBadges = useMemo(() => {
    if (!profileData?.latest_report?.name_of_skill_badges_completed) return [];
    return profileData.latest_report.name_of_skill_badges_completed
      .split('|')
      .map(name => name.replace('[Skill Badge]', '').trim())
      .filter(Boolean);
  }, [profileData]);

  const completedArcadeGames = useMemo(() => {
    if (!profileData?.latest_report?.name_of_arcade_games_completed) return [];
    return profileData.latest_report.name_of_arcade_games_completed
      .split('|')
      .map(name => name.replace('[Game]', '').trim())
      .filter(Boolean);
  }, [profileData]);

  const lastLabCompletionContent = useMemo(() => {
    if (!profileData) return null;

    const report = profileData.latest_report;

    if (report.last_lab_completed_date) { 
      return new Date(report.last_lab_completed_date ).toLocaleString('en-US', { dateStyle: 'long' });
    }

    if (report.no_of_skill_badges_completed === 0 && report.no_of_arcade_games_completed === 0) {
      return <span className="text-red-500">No Badges Earned</span>;
    }

    return `Before ${new Date(report.report_date).toLocaleString('en-US', { dateStyle: 'medium' })}`;
  }, [profileData]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const API = `${BASE_URL}/my-progress`;

      try {
        const response = await fetch(API, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile data.');
        }

        const result = await response.json();
        
        // Check if data exists
        if (!result.data || !result.data.latest_report) {
          setProfileData(null);
        } else {
          setProfileData(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const syllabusCompleted = profileData?.latest_report?.no_of_skill_badges_completed >= 19 && profileData?.latest_report?.no_of_arcade_games_completed >= 1;
    
    if (syllabusCompleted) {
      if (!ConfettiComponent) {
        import('react-confetti').then(module => {
          const Confetti = module.default;
          setConfettiComponent(() => Confetti); // Store component in state
          setConfettiProps({ width: window.innerWidth, height: window.innerHeight });
        });
      }

      setShowConfetti(true);
      setRecycleConfetti(true);
      const timer = setTimeout(() => {
          setRecycleConfetti(false);
      }, 5000); // Stop recycling after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [profileData, ConfettiComponent]);

  const getActivityIcon = (iconName) => {
    const iconMap = {
      'emoji_events': Trophy,
      'science': FlaskConical,
      'group': Users
    }
    const IconComponent = iconMap[iconName] || Trophy
    return <IconComponent className="w-3 h-3" />
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col">
      {showConfetti && ConfettiComponent && (
        <ConfettiComponent
          {...confettiProps}
          recycle={recycleConfetti}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
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
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <p>Error: {error}</p>
              </div>
            ) : !profileData || !profileData.latest_report ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <XCircle className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Profile Data Available
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  You don't have any profile data yet. This could be because you are not registered as a participant or your data hasn't been synced yet.
                </p>
                {/* Logout Button for users without profile data */}
                <button
                  onClick={handleLogout}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : profileData && (
              <>
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img
                        alt={`${profileData.latest_report.name}'s profile picture`}
                        className="h-32 w-32 rounded-full object-cover"
                        src={PROFILE_DATA.image}
                      />
                      {/* Leaderboard Rank */}
                      {/* <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                        #{PROFILE_DATA.rank}
                      </div> */}
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profileData.latest_report.name}
                      </p>
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        {profileData.latest_report.email}
                      </p>
                      {profileData.latest_report.skill_boost_url && (
                        <a
                          href={profileData.latest_report.skill_boost_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          My Public Profile <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>


                {/* Progress Section */}
                <section className="mt-6">
                  <h2 className="px-2 pb-2 text-lg font-bold text-gray-900 dark:text-white">
                    <span className="text-gray-500 dark:text-gray-400 text-medium text-base">Updated On: </span>{new Date(profileData.latest_report.report_date).toLocaleString('en-US', { dateStyle: 'medium' })}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50 text-center">
                      <div className="flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Award className="h-4 w-4 mr-2 sm:block hidden text-blue-500" />
                        <span>Skill Badges Completed</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-500">
                        {profileData.latest_report.no_of_skill_badges_completed}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50 text-center">
                      <div className="flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Gamepad2 className="h-4 w-4 mr-2 sm:block hidden text-purple-500" />
                        <span>Arcade Games Completed</span>
                      </div>
                      <p className="text-3xl font-bold text-purple-500">
                        {profileData.latest_report.no_of_arcade_games_completed}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Last Lab Completion
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {lastLabCompletionContent}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Syllabus Completion Banner */}
                {profileData.latest_report.no_of_skill_badges_completed >= 19 && profileData.latest_report.no_of_arcade_games_completed >= 1 && (
                  <section className="mt-8">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 text-white shadow-lg">
                      <div className="flex items-center">
                        <Trophy className="h-10 w-10 mr-4 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-xl">Congratulations!</h3>
                          <p className="text-sm">You have completed the whole syllabus of Study Jams '25.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Badge Status Section */}
                <section className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="px-2 pb-2 text-lg font-bold text-blue-500">Skill Badges Status</h3>
                      <ul className="space-y-2">
                        {skillBadges.map(badge => (
                          <li key={badge.id}>
                            <a href={badge.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                              <span className="text-sm text-gray-800 dark:text-gray-300">{badge.name}</span>
                              {completedSkillBadges.includes(badge.name) ? (
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" title="Completed" />
                              ) : (
                                <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" title="Not Completed" />
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="px-2 pb-2 text-lg font-bold text-purple-500">Arcade Games Status</h3>
                      <ul className="space-y-2">
                        {arcadeGames.map(game => (
                          <li key={game.id}>
                            <a href={game.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                              <span className="text-sm text-gray-800 dark:text-gray-300">{game.name}</span>
                              {completedArcadeGames.includes(game.name) ? (
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" title="Completed" />
                              ) : (
                                <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" title="Not Completed" />
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Activity Feed Section: HIDE TEMPORARILY */}
                {/* <ActivityFeedSection /> */}

                {/* Logout Button Section */}
                <section className="mt-8 flex justify-center">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </section>
              </>
            )}
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