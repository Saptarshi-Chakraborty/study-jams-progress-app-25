"use client"

import BodyLogin from '@/components/Login/Body'
import Head from 'next/head'

const Login = () => {
    return (
        <>
            <Head>
                <title>Login | Study Jams Progress Tracker</title>
                <link rel="icon" href="/icon-16x9.png" type="image/png" sizes="16x9"/>
                <link rel="icon" href="/icon-32x18.png" type="image/png" sizes="32x18"/>
            </Head>

            <BodyLogin />
        </>
    )
}

export default Login