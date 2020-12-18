import Head from 'next/head';
import { Text } from '@fluentui/react-northstar';

export default function Privacy() {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Text content="Privacy" size="larger"/>
            </main>
        </div>
    )
}
