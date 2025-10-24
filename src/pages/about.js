"use client"

import BodyAbout from '@/components/About/BodyAbout'
import { TopUserBar } from '@/components/shared/TopUserBar'
import Head from 'next/head'

const About = () => {
    return (
        <>
            <Head>
                <title>About | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <TopUserBar />
            <BodyAbout />
        </>
    )
}

export default About