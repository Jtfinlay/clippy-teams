import Head from 'next/head';
import { Flex, Text } from '@fluentui/react-northstar';

export default function Privacy() {
    return (
        <Flex column hAlign="center" >
            <Head>
                <title>Privacy</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Flex column hAlign="center" style={{ width:"100%", height:"100vh" }} gap="gap.small">
                <Text content="Privacy" size="larger"/>
                
                <iframe src="/privacy.html" width="100%" height="100%"/>
            </Flex>
        </Flex>
    )
}
