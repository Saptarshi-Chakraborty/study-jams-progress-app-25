import BodyAbout from '@/components/About/BodyAbout'
import Head from 'next/head'

const About = () => {
    return (
        <>
            <Head>
                <title>About | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <BodyAbout />
        </>
    )
}

export default About