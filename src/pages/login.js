"use client"

import BodyLogin from '@/components/Login/Body'
import Head from 'next/head'

const Login = () => {
    return (
        <>
            <Head>
                <title>Login | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <BodyLogin />
        </>
    )
}

export default Login