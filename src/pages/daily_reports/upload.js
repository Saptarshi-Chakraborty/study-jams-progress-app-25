"use client"

import BodyUploadReport from '@/components/DailyReports/UploadReport/BodyUploadReport'
import AuthHOC from '@/components/shared/AuthHOC'
import { TopUserBar } from '@/components/shared/TopUserBar'
import { ROLES } from '@/context/GlobalContext'
import Head from 'next/head'

const UploadReport = () => {
    return (
        <>
            <Head>
                <title>Upload Report | Study Jams Progress Tracker</title>
            </Head>

            <TopUserBar />
            <BodyUploadReport />
        </>
    )
}

export default AuthHOC(UploadReport, { role: [ROLES.ADMIN, ROLES.ORGANISER] })