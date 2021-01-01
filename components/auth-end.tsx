import React from 'react';
import Head from 'next/head';
import * as microsoftTeams from "@microsoft/teams-js";

export default function AuthEnd() {

    function getHashParameters() {
        let hashParams = {};
        location.hash.substr(1).split("&").forEach(function(item) {
            let s = item.split("="),
            k = s[0],
            v = s[1] && decodeURIComponent(s[1]);
            hashParams[k] = v;
        });
        return hashParams;
    }

    React.useEffect(() => {

        async function setup() {
            microsoftTeams.initialize();
            
            // Split the key-value pairs passed from Azure AD
            // getHashParameters is a helper function that parses the arguments sent
            // to the callback URL by Azure AD after the authorization call
            let hashParams = getHashParameters();
            if (hashParams["error"]) {
                // Authentication/authorization failed
                microsoftTeams.authentication.notifyFailure(hashParams["error"]);
            } else if (hashParams["access_token"]) {
                // Get the stored state parameter and compare with incoming state
                // This validates that the data is coming from Azure AD
                let expectedState = localStorage.getItem("simple.state");
                if (expectedState !== hashParams["state"]) {
                    // State does not match, report error
                    microsoftTeams.authentication.notifyFailure("StateDoesNotMatch");
                } else {
                    // Success: return token information to the tab
                    microsoftTeams.authentication.notifySuccess(JSON.stringify({
                        idToken: hashParams["id_token"],
                        accessToken: hashParams["access_token"],
                        tokenType: hashParams["token_type"],
                        expiresIn: hashParams["expires_in"]
                    }));
                }
            } else {
                // Unexpected condition: hash does not contain error or access_token parameter
                microsoftTeams.authentication.notifyFailure("UnexpectedFailure");
            }
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
