import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios, { CancelTokenSource } from 'axios';
import { Box, Button, Flex } from '@fluentui/react-northstar';
import DialogViewer from '../components/createDialog/dialogViewer';
import styles from '../styles/Home.module.css'
import AvatarList from '../components/avatarList';
import {fetchVideos} from '../utils/api';

export default function Home() {
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());

    React.useEffect(() => {
        const token = cancelToken.current;
        return () => {
            token.cancel();
        }
    }, [cancelToken]);

    return (
        <Flex column hAlign="center">
            <Head>
                <title>Clippies</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main style={{ padding: '5rem 0', width: '60rem' }}>
                <Flex column gap="gap.large" hAlign="center">
                    <AvatarList />
                    <Box>
                        <DialogViewer />
                        <Button content="Fetch" onClick={() => fetchVideos(cancelToken.current.token)}/>
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
