"use client"

import BodyAbout from '@/components/About/BodyAbout'
import { TopUserBar } from '@/components/shared/TopUserBar'
import Head from 'next/head'

const About = () => {
    return (
        <>
            <Head>
                <title>About | Study Jams Progress Tracker</title>
                <link rel="icon" href="/Icon-16x9.png" type="image/png" sizes="16x9"/>
                <link rel="icon" href="/Icon-32x18.png" type="image/png" sizes="32x18"/>
            </Head>

            <TopUserBar />
            <BodyAbout />
        </>
    )
}

export default About