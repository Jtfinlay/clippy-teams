import Head from 'next/head';
import { Text } from '@fluentui/react-northstar';

export default function Terms() {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Text content="Terms of Use" size="larger"/>
            </main>
        </div>
    )
}
