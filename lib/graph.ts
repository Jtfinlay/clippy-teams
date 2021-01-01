import AppError from "./appError";

/**
 * Exchange client-side token for a server token with required permissions
 * @param clientSideToken 
 * @param tenantId
 */
export async function getServerSideToken(clientSideToken: string, tenantId: string): Promise<{result?: any, error?: AppError, statusCode: number }> {
    const AZURE_APPLICATION_ID = process.env.AZURE_APPLICATION_ID;
    const AZURE_APPLICATION_SECRET = process.env.AZURE_APPLICATION_SECRET;

    const scopes = ["https://graph.microsoft.com/User.Read"];

    const formData = new URLSearchParams();
    formData.append("client_id", AZURE_APPLICATION_ID);
    formData.append("client_secret", AZURE_APPLICATION_SECRET);
    formData.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    formData.append("assertion", clientSideToken);
    formData.append("requested_token_use", "on_behalf_of");
    formData.append("scope", scopes.join(" "));

    try {
        const response = await fetch(
            `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
            { method: 'POST', body: formData, }
        );

        const json = await response.json();
        if (response.status !== 200) {
            return { error: json, statusCode: response.status };
        }

        return { result: json, statusCode: 200 };

    } catch (err) {
        console.error(err.message);
        return { error: { error: "Unknown failure", error_description: "Unknown failure. Please try again later."}, statusCode: 502 };
    }
}