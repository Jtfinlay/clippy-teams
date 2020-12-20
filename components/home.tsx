import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Flex } from '@fluentui/react-northstar';
import axios, { CancelTokenSource } from 'axios';
import * as microsoftTeams from "@microsoft/teams-js";
import { fetchVideos } from '../utils/api';
import AvatarList from './avatarList';
import ClipDialog from './clipDialog';
import CreateContent from './createDialog/createContent';
import ViewContent from './viewDialog/viewContent';
import styles from '../styles/Home.module.css'

enum DIALOG_STATE {
    CLOSED = 'closed',
    VIEW = 'view',
    CREATE = 'create'
}

export default function Home() {
    const [dialogState, setDialogState] = React.useState(DIALOG_STATE.CLOSED);
    const [selectedUser, setSelectedUser] = React.useState('');
    const [fetching, setFetching] = React.useState(false);
    const [error, setError] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());

    async function refresh() {
        if (fetching) return;

        setFetching(true);
        const response = await fetchVideos(cancelToken.current.token);
        if (response.error) {
            setError(response.error);
        } else {
            setUsers(response.result!.users);
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

    microsoftTeams.initialize();

    return (
        <Flex column hAlign="center">
            <Head>
                <title>Clippies</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main style={{ padding: '5rem 0', width: '60rem' }}>
                <Flex column gap="gap.large" hAlign="center">
                    <AvatarList
                        createClippy={() => setDialogState(DIALOG_STATE.CREATE)}
                        viewUserClippy={(id) => { setSelectedUser(id); setDialogState(DIALOG_STATE.VIEW) }}
                        refresh={() => refresh()}
                        users={users}
                        fetching={fetching}
                        error={error}
                    />

                    <Box>
                        <ClipDialog open={dialogState === DIALOG_STATE.VIEW || dialogState === DIALOG_STATE.CREATE}>
                            <>
                                {dialogState === DIALOG_STATE.CREATE && <CreateContent close={() => setDialogState(DIALOG_STATE.CLOSED)}/>}
                                {dialogState === DIALOG_STATE.VIEW && (
                                    <ViewContent
                                        close={() => setDialogState(DIALOG_STATE.CLOSED)}
                                        users={users}
                                        activeUser={selectedUser}
                                    />
                                )}
                            </>
                        </ClipDialog>
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
