"use client"

import BodyViewAllReports from '@/components/DailyReports/BodyViewAllReports'
import AuthHOC from '@/components/shared/AuthHOC'
import { TopUserBar } from '@/components/shared/TopUserBar'
import { ROLES } from '@/context/GlobalContext'
import Head from 'next/head'

const UploadReport = () => {
    return (
        <>
            <Head>
                <title>View Daily Report | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <TopUserBar />
            <BodyViewAllReports />
        </>
    )
}

export default AuthHOC(UploadReport, { role: [ROLES.ADMIN, ROLES.ORGANISER, ROLES.TEAM_MEMBER] })