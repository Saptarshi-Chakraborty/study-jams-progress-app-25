"use client"

import BodyViewAllReports from '@/components/DailyReports/BodyViewAllReports'
import { TopUserBar } from '@/components/shared/TopUserBar'
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

export default UploadReport