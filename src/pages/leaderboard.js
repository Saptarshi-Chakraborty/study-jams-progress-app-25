import BodyLeaderboard from '@/components/Leaderboard/BodyLeaderboard'
import Head from 'next/head'

const Leaderboard = () => {
    return (
        <>
            <Head>
                <title>Leaderboard | Study Jams Progress Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <BodyLeaderboard />
        </>
    )
}

export default Leaderboard