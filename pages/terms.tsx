import Head from 'next/head';
import { Flex, Text } from '@fluentui/react-northstar';

export default function Terms() {
    return (
        <Flex column hAlign="center" >
            <Head>
                <title>Terms of Use</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Flex column hAlign="center" style={{ width:"100%", height:"100vh" }} gap="gap.small">
                <Text content="Terms of Use" size="larger"/>
                
                <iframe src="/terms.html" width="100%" height="100%"/>
            </Flex>
        </Flex>
    )
}
