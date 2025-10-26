"use client"

import BodyLeaderboard from '@/components/Leaderboard/BodyLeaderboard'
import { TopUserBar } from '@/components/shared/TopUserBar'
import Head from 'next/head'

const Leaderboard = ({ initialLeaderboardData, reportDate }) => {
    return (
        <>
            <Head>
                <title>Study Jams Progress Tracker '25</title>
                <link rel="icon" href="/icon-16x9.png" type="image/png" sizes="16x9"/>
                <link rel="icon" href="/icon-32x18.png" type="image/png" sizes="32x18"/>

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content="Study Jams Progress Tracker '25" />
                <meta property="og:description" content="Track your progress in Study Jams '25" />
                <meta property="og:image" content="/icon-16x9.png" />
                <meta property="og:url" content="https://study-jams-25.pages.dev/" />    

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Study Jams Progress Tracker '25" />
                <meta name="twitter:description" content="Track your progress in Study Jams '25" />
                <meta name="twitter:image" content="/icon-16x9.png" />
                <meta name="twitter:url" content="https://study-jams-25.pages.dev/" />
            </Head>

            <TopUserBar />
            <BodyLeaderboard initialData={initialLeaderboardData} reportDate={reportDate} />
        </>
    )
}

export async function getStaticProps() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const API = `${BASE_URL}/leaderboard`;

    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sortBy: 'rank' })
        });

        const result = await response.json();

        return {
            props: {
                initialLeaderboardData: result.status === 'success' ? result.data : [],
                reportDate: result.status === 'success' ? result.reportDate : null
            }
            // Remove the revalidate option for static export
        };
    } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        return {
            props: {
                initialLeaderboardData: [],
                reportDate: null
            }
        };
    }
}

export default Leaderboard