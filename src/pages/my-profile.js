"use client"

import BodyMyProfile from '@/components/MyProfile/BodyMyProfile'
import Head from 'next/head'

const MyProfile = () => {
    return (
        <>
            <Head>
                <title>My Profile | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <BodyMyProfile />
        </>
    )
}

export default MyProfile