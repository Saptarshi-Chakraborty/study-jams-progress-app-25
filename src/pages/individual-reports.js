"use client"

import BodyIndividualReport from '@/components/IndividualReport/BodyIndividualReport'
import AuthHOC from '@/components/shared/AuthHOC'
import { TopUserBar } from '@/components/shared/TopUserBar'
import { ROLES } from '@/context/GlobalContext'
import Head from 'next/head'

const IndividualReport = () => {
    return (
        <>
            <Head>
                <title>Individual Report | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <TopUserBar />
            <BodyIndividualReport />
        </>
    )
}

// export default IndividualReport
export default AuthHOC(IndividualReport, { role: [ROLES.ADMIN, ROLES.ORGANISER, ROLES.TEAM_MEMBER] })