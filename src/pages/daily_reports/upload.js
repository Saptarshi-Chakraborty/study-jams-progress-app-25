"use client"

import BodyUploadReport from '@/components/DailyReports/UploadReport/BodyUploadReport'
import Head from 'next/head'

const UploadReport = () => {
    return (
        <>
            <Head>
                <title>Upload Report | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <BodyUploadReport />
        </>
    )
}

export default UploadReport