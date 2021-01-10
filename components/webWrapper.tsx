import React from 'react';
import axios, { CancelTokenSource } from 'axios';
import { Button, Flex, Text } from '@fluentui/react-northstar';
import { PublicClientApplication } from '@azure/msal-browser';
import * as msal from '../utils/msal';

interface IOwnProps {
    children: JSX.Element
}

export default function WebWrapper(props: IOwnProps) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [tenantId, setTenantId] = React.useState('');
    const [error, setError] = React.useState('');
    const msalApplication = React.useRef<PublicClientApplication>();
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());
    const AZURE_APPLICATION_ID = process.env.NEXT_PUBLIC_AZURE_APPLICATION_ID;

    const config = {
        appId: AZURE_APPLICATION_ID,
        authority: "https://login.microsoftonline.com/organizations",
        redirectUri: window.location.origin + "/web",
        scopes: [
            'User.Read',
            'openid'
        ]
    };

    async function login() {
        try {
            await msalApplication.current.loginPopup({
                scopes: config.scopes,
                prompt: "select_account"
            });

            const response = await msal.getUserProfile(msalApplication.current, config.scopes);
            if (response.isAuthenticated) {
                setTenantId(msal.getTenantId(msalApplication.current));
            }
            setIsAuthenticated(response.isAuthenticated);
            setError(response.error);
        } catch (err) {
            setIsAuthenticated(false);
            setError(msal.normalizeError(err).message);
        }
    }

    async function getAuthToken(): Promise<string> {
        return msal.getAccessToken(msalApplication.current, config.scopes);
    }

    React.useEffect(() => {
        async function setup() {
            msalApplication.current = new PublicClientApplication({
                auth: {
                    clientId: config.appId,
                    redirectUri: config.redirectUri,
                },
                cache: {
                    cacheLocation: 'sessionStorage',
                    storeAuthStateInCookie: true
                }
            });
            
            const accounts = msalApplication.current.getAllAccounts();

            if (accounts?.length > 0) {
                const response = await msal.getUserProfile(msalApplication.current, config.scopes);
                setTenantId(accounts[0].tenantId);
                setIsAuthenticated(response.isAuthenticated);
                setError(response.error);
            }
        }

        setup();
    }, []);

    React.useEffect(() => {
        const token = cancelToken.current;
        return () => {
            token.cancel();
        }
    }, [cancelToken]);

    if (!isAuthenticated) {
        return (
            <Flex column hAlign="center" gap="gap.small">
                <Text content="Please sign in with your Microsoft work account to continue." />
                <Button content="Authorize" onClick={() => login()}/>
                <Text error content={error}/>
            </Flex>
        )
    }

    return React.cloneElement(props.children, { tenantId, getAuthToken })
}