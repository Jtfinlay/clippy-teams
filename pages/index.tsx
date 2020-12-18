import Head from 'next/head';
import Link from 'next/link';
import { Box, Button, Flex } from '@fluentui/react-northstar';
import DialogViewer from '../components/createDialog/dialogViewer';
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <Flex column hAlign="center">
            <Head>
                <title>Clippies</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main style={{ padding: '5rem 0' }}>
                <Flex column gap="gap.large" hAlign="center">
                    <Flex>
                        <span>New clippies will be available here. Show profile pic with outlined border</span>
                    </Flex>
                    <Box>
                        <DialogViewer />
                    </Box>
                </Flex>
            </main>

            <footer className={styles.footer}>
                <Flex gap="gap.small">
                    <Link href="/terms"><a>Terms of Use</a></Link>
                    <Link href="/privacy"><a>Privacy</a></Link>
                </Flex>
            </footer>
        </Flex>
    )
}
