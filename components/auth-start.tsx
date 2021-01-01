import React from 'react';
import Head from 'next/head';
import * as microsoftTeams from "@microsoft/teams-js";
import { v4 as uuidv4 } from 'uuid';
import { getContext } from '../utils/teams';

export default function AuthStart() {

    React.useEffect(() => {

        async function setup() {
            microsoftTeams.initialize();
            const context = await getContext();

            // Generate random state string and store it, so we can verify it in the callback
            let state = uuidv4();
            localStorage.setItem("simple.state", state);
            localStorage.removeItem("simple.error");

            // Go to the Azure AD authorization endpoint
            let queryParams = {
                client_id: "0ca69a0e-3cdd-4f19-a8e0-c1bed95b7510",
                response_type: "id_token token",
                response_mode: "fragment",
                scope: "https://graph.microsoft.com/User.Read openid",
                redirect_uri: window.location.origin + "/auth-end",
                nonce: uuidv4(),
                state: state,
                // The context object is populated by Teams; the loginHint attribute
                // is used as hinting information
                login_hint: context.loginHint,
            };

            let authorizeEndpoint = `https://login.microsoftonline.com/${context.tid}/oauth2/v2.0/authorize?${new URLSearchParams(queryParams).toString()}`;
            window.location.assign(authorizeEndpoint);
        }

        setup();
    }, []);

    return (
        <div>
            <Head>
                <title>Authorize Clippy</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </div>
    )
}
