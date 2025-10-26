"use client"

import BodyMyProfile from '@/components/MyProfile/BodyMyProfile'
import BodyParticipants from '@/components/Participants/BodyParticipants'
import AuthHOC from '@/components/shared/AuthHOC'
import { TopUserBar } from '@/components/shared/TopUserBar'
import { ROLES } from '@/context/GlobalContext'
import Head from 'next/head'

const MyParticipants = () => {
    return (
        <>
            <Head>
                <title>My Participants | Study Jams Progress Tracker</title>
            </Head>

            <TopUserBar />
            <BodyParticipants />
        </>
    )
}

export default AuthHOC(MyParticipants, { role: [ROLES.ADMIN, ROLES.ORGANISER, ROLES.TEAM_MEMBER] })