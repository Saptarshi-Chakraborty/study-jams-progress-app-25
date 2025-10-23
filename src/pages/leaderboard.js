"use client"

import BodyLeaderboard from '@/components/Leaderboard/BodyLeaderboard'
import { TopUserBar } from '@/components/shared/TopUserBar'
import Head from 'next/head'

const Leaderboard = () => {
    return (
        <>
            <Head>
                <title>Leaderboard | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <TopUserBar />
            <BodyLeaderboard />
        </>
    )
}

export default Leaderboard