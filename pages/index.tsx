import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Flex } from '@fluentui/react-northstar';
import DialogViewer from '../components/createDialog/dialogViewer';
import styles from '../styles/Home.module.css'
import AvatarList from '../components/avatarList';

export default function Home() {
    const [open, setOpen] = React.useState(false);

    return (
        <Flex column hAlign="center">
            <Head>
                <title>Clippies</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main style={{ padding: '5rem 0', width: '60rem' }}>
                <Flex column gap="gap.large" hAlign="center">
                    <AvatarList
                        createClippy={() => setOpen(true)}
                        viewUserClippy={(id) => {}}
                    />
                    <Box>
                        <DialogViewer open={open} setOpen={(v) => setOpen(v)}/>
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
