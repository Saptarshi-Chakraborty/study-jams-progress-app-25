"use client"

import BodyAbout from '@/components/About/BodyAbout'
import BodyMyTeamMembers from '@/components/organizer/team-members/BodyMyTeamMembers'
import { TopUserBar } from '@/components/shared/TopUserBar'
import Head from 'next/head'

const MyTeamMembers = () => {
    return (
        <>
            <Head>
                <title>My Team Members | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <TopUserBar />
            <BodyMyTeamMembers />
        </>
    )
}

export default MyTeamMembers