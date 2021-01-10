import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex, Text } from '@fluentui/react-northstar';
import axios, { CancelTokenSource } from 'axios';
import { fetchUserInfo, fetchContent } from '../utils/api';
import AvatarList from './avatarList';
import ClipDialog from './clipDialog';
import styles from '../styles/Home.module.css'
import ClipView from './clipView';

interface IOwnProps {
    tenantId: string,
    getAuthToken: () => Promise<string>,
}

export default function Home(props: IOwnProps) {
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

        const authToken = await props.getAuthToken();
        const userResponse = await fetchUserInfo(authToken, props.tenantId, cancelToken.current.token);

        if (userResponse.error) {
            setError(userResponse.error);
            setFetching(false);
            return;
        } else {
            setLocalUserId(userResponse.result!.id);
        }

        const response = await fetchContent(authToken, props.tenantId, cancelToken.current.token);
        
        if (response.error) {
            setError(response.error);
        } else {
            // Ensure local user is at the start of the array.
            let userList = response.result!.users;
            userList = userList.filter(u => u.id !== userResponse.result!.id);
            userList.unshift(userResponse.result!);
            setUsers(userList);
        }

        setFetching(false);
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

            <main style={{ padding: '5rem 0', maxWidth: '60rem' }}>
                <Flex column gap="gap.large" hAlign="center">
                    <AvatarList
                        addClippy={() => { setSelectedView('create'); setDialogOpen(true); }}
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
                                {...props}
                                success={() => { setDialogOpen(false); refresh(); }}
                                close={() => setDialogOpen(false)}
                                users={users}
                                localUserId={localUserId}
                                defaultIndex={selectedView}
                            />
                        </ClipDialog>
                    </Box>

                    <Image width={250} height={250} src="/clippy.gif"/>
                    <br/>
                    <Text>Notice: Expect a broken experience on Safari / iOS for now.</Text>
                </Flex>

            </main>

            <footer className={styles.footer}>
                <Flex column>
                    <Flex gap="gap.small" hAlign="center">
                        <Link href="/terms"><a target="_blank">Terms of Use</a></Link>
                        <Link href="/privacy"><a target="_blank">Privacy</a></Link>
                    </Flex>
                    <Text>Clippies was made with ♥ by <Link href="https://twitter.com/JtFinlay"><a target="_blank">@Jtfinlay</a></Link>. This application is open-source and available on <Link href="https://github.com/Jtfinlay/clippy-teams"><a target="_blank">Github</a></Link>.</Text>
                </Flex>
            </footer>
        </Flex>
    )
}
