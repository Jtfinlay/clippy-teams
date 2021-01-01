import * as microsoftTeams from "@microsoft/teams-js";

export function getContext(): Promise<microsoftTeams.Context> {
    return new Promise<microsoftTeams.Context>((res, rej) => {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            res(context);
        });
    });
}

export function getAuthToken(): Promise<string> {
    return new Promise<string>((res, rej) => {
        const authTokenRequest = {
            successCallback: function(token: string) {
                res(token);
            },
            failureCallback: function(reason: string) {
                rej(reason);
            }
        };
        microsoftTeams.authentication.getAuthToken(authTokenRequest);
    })
}