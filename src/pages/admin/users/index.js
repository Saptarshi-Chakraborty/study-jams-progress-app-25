"use client"

import BodyViewAllUsers from '@/components/admin/users/BodyViewAllUsers'
import AuthHOC from '@/components/shared/AuthHOC'
import { TopUserBar } from '@/components/shared/TopUserBar'
import { ROLES } from '@/context/GlobalContext'
import Head from 'next/head'

const Users = () => {
    return (
        <>
            <Head>
                <title>Users | Admin | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <TopUserBar />
            <BodyViewAllUsers />
        </>
    )
}

// export default Users
export default AuthHOC(Users, { role: ROLES.ADMIN })