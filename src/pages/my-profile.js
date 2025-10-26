"use client"

import BodyMyProfile from '@/components/MyProfile/BodyMyProfile'
import AuthHOC from '@/components/shared/AuthHOC'
import { TopUserBar } from '@/components/shared/TopUserBar'
import Head from 'next/head'

const MyProfile = () => {
    return (
        <>
            <Head>
                <title>My Profile | Study Jams Progress Tracker</title>
                <link rel="icon" href="/Icon-16x9.png" type="image/png" sizes="16x9"/>
                <link rel="icon" href="/Icon-32x18.png" type="image/png" sizes="32x18"/>
            </Head>

            <TopUserBar />
            <BodyMyProfile />
        </>
    )
}

// export default MyProfile
export default AuthHOC(MyProfile)