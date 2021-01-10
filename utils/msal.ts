import { PublicClientApplication } from "@azure/msal-browser";

// Most logic below is from: https://docs.microsoft.com/en-us/graph/tutorials/react?tutorial-step=3

export async function getUserProfile(msalApplication: PublicClientApplication, scopes: string[]): Promise<{isAuthenticated: boolean, error: string}> {
    try {
      const accessToken = await getAccessToken(msalApplication, scopes);

      if (accessToken) {
            return {
                isAuthenticated: true,
                error: ''
            };
      }
    }
    catch (err) {
        return {
            isAuthenticated: false,
            error: normalizeError(err)
        };
    }
}

export function getTenantId(msalApplication: PublicClientApplication): string {
    const accounts = msalApplication.getAllAccounts();

    if (accounts.length <= 0) return undefined;
    return accounts[0].tenantId;
}

export async function getAccessToken(msalApplication: PublicClientApplication, scopes: string[]): Promise<string> {
    try {
        const accounts = msalApplication.getAllAccounts();
        
        if (accounts.length <= 0) throw new Error('login_required');

        // Get the access token silently
        // If the cache contains a non-expired token, this function
        // will just return the cached token. Otherwise, it will
        // make a request to the Azure OAuth endpoint to get a token
        const silentResult = await msalApplication
            .acquireTokenSilent({
                scopes: scopes,
                account: accounts[0]
            });

        return silentResult.accessToken;
    } catch (err) {
        // If a silent request fails, it may be because the user needs
        // to login or grant consent to one or more of the requested scopes
        if (isInteractionRequired(err)) {
            var interactiveResult = await msalApplication
                .acquireTokenPopup({
                    scopes: scopes
                });

            return interactiveResult.accessToken;
        } else {
            throw err;
        }
    }
}

export function normalizeError(error: string | Error): any {
    var normalizedError = {};
    if (typeof(error) === 'string') {
        var errParts = error.split('|');
        normalizedError = errParts.length > 1 ?
            { message: errParts[1], debug: errParts[0] } :
            { message: error };
    } else {
        normalizedError = {
            message: error.message,
            debug: JSON.stringify(error)
        };
    }
    return normalizedError;
  }


function isInteractionRequired(error: Error): boolean {
    if (!error.message || error.message.length <= 0) {
        return false;
    }

    return (
        error.message.indexOf('consent_required') > -1 ||
        error.message.indexOf('interaction_required') > -1 ||
        error.message.indexOf('login_required') > -1 ||
        error.message.indexOf('no_account_in_silent_request') > -1
    );
}