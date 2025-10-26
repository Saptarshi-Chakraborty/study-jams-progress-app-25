"use client"

import BodyViewAllChapters from '@/components/admin/chapters/BodyViewAllChapters'
import AuthHOC from '@/components/shared/AuthHOC'
import { TopUserBar } from '@/components/shared/TopUserBar'
import { ROLES } from '@/context/GlobalContext'
import Head from 'next/head'

const Chapters = () => {
    return (
        <>
            <Head>
                <title>Chapters | Admin | Study Jams Progress Tracker</title>
            </Head>

            <TopUserBar />
            <BodyViewAllChapters />
        </>
    )
}

// export default Chapters
export default AuthHOC(Chapters, { role: ROLES.ADMIN })