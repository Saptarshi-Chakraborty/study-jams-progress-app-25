"use client"

import BodyViewAllChapters from '@/components/admin/chapters/BodyViewAllChapters'
import Head from 'next/head'

const Leaderboard = () => {
    return (
        <>
            <Head>
                <title>Chapters | Admin | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <BodyViewAllChapters />
        </>
    )
}

export default Leaderboard