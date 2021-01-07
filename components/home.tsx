import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex } from '@fluentui/react-northstar';
import axios, { CancelTokenSource } from 'axios';
import { fetchUserInfo, fetchContent } from '../utils/api';
import AvatarList from './avatarList';
import ClipDialog from './clipDialog';
import * as teams from '../utils/teams';
import styles from '../styles/Home.module.css'
import ClipView from './clipView';

export default function Home() {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedView, setSelectedView] = React.useState('');
    const [fetching, setFetching] = React.useState(false);
    const [error, setError] = React.useState('');
    const [localUserId, setLocalUserId] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());

    async function refresh() {
        if (fetching) return;

        setFetching(true);
        setError('');

        const context = await teams.getContext();
        const authToken = await teams.getAuthToken();
        const userResponse = await fetchUserInfo(authToken, context.tid, cancelToken.current.token);

        if (userResponse.error) {
            setError(userResponse.error);
            setFetching(false);
            return;
        } else {
            setLocalUserId(userResponse.result!.id);
        }

        const response = await fetchContent(authToken, context.tid, cancelToken.current.token);
        
        if (response.error) {
            setError(response.error);
        } else {
            const userList = response.result!.users;
            if (!userList.find(u => u.id === userResponse.result!.id)) {
                userList.push(userResponse.result!);
            }
            setUsers(userList);
        }

        setFetching(false);
    }

    function viewLocalUser() {
        const localUser = users.find(u => u.id === localUserId);
        if (localUser.entries.length > 0) {
            setSelectedView('me');
        } else {
            setSelectedView('create');
        }
        setDialogOpen(true);
    }

    React.useEffect(() => {
        refresh();
    }, []);

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
                    <AvatarList
                        viewLocalUser={() => viewLocalUser()}
                        viewUserClippy={(id) => { setSelectedView(id); setDialogOpen(true) }}
                        refresh={() => refresh()}
                        users={users}
                        fetching={fetching}
                        error={error}
                        localUserId={localUserId}
                    />

                    <Box>
                        <ClipDialog open={dialogOpen}>
                            <ClipView
                                close={() => setDialogOpen(false)}
                                users={users}
                                localUserId={localUserId}
                                defaultIndex={selectedView}
                            />
                        </ClipDialog>
                    </Box>

                    <Image width={250} height={250} src="/clippy.gif"/>
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
