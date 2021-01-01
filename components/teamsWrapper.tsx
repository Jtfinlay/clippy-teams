import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import * as teams from '../utils/teams';
import * as api from '../utils/api';
import axios, { CancelTokenSource } from 'axios';
import { Button, Flex, Text } from '@fluentui/react-northstar';

interface IOwnProps {
    children: JSX.Element
}

export default function TeamsWrapper(props: IOwnProps) {
    const [ready, setReady] = React.useState(false);
    const [showConsent, setShowConsent] = React.useState(false);
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());

    function requestConsent() {
        return new Promise((res, rej) => {
            microsoftTeams.authentication.authenticate({
                url: `${window.location.origin}/auth-start`,
                width: 600,
                height: 535,
                successCallback: (result) => {
                    let data =localStorage.getItem(result);
                    localStorage.removeItem(result);
                    res(data);
                    setReady(true);
                },
                failureCallback: (reason) => {
                    rej(JSON.stringify(reason));
                }
            })
        })
    }

    React.useEffect(() => {
        async function setup() {
            microsoftTeams.initialize();
            const context = await teams.getContext();
            const authToken = await teams.getAuthToken();
            const serverToken = await api.authConsent(authToken, context.tid, cancelToken.current.token);
            if (serverToken.error?.isAxiosError && serverToken.error.response.data.error === 'invalid_grant') {
                setShowConsent(true);
            } else {
                setReady(true);
            }
            // todo - handle other auth failures
        }

        setup();
    }, []);

    React.useEffect(() => {
        const token = cancelToken.current;
        return () => {
            token.cancel();
        }
    }, [cancelToken]);

    if (showConsent) {
        return (
            <Flex column hAlign="center" gap="gap.small">
                <Text content="Please authorize the Clippy application to access profile information." />
                <Button content="Authorize" onClick={() => requestConsent()}/>
            </Flex>
        )
    }

    if (ready) {
        return props.children;
    }

    return <div />
}