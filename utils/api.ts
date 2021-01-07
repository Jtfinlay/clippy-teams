import axios, { AxiosError, CancelToken } from 'axios';
import { IFetchEntriesResponse, IFetchUserResponse } from '../lib/storage';

export async function uploadVideo(clientToken: string, tenantId: string, blob: Blob, cancelToken: CancelToken): Promise<{result?: any, error?: string}> {
    try {
        const formData = new FormData();
        formData.append("video", blob);
        const response = await axios.post(
            `/api/upload-video/${tenantId}`,
            formData,
            {
                headers: {
                    'Authorization': clientToken,
                    'Content-Type': 'multipart/form-data'
                },
                cancelToken
            }
        );
        
        if (response.status !== 201) {
            return { error: `Failure uploading video. Please try again later. Code: ${response.status}`};
        }

        return { result: response.data };
    } catch (err) {
        return { error: `Failure uploading video. Please try again later.`};
    }
}

export async function uploadImage(clientToken: string, tenantId: string, blob: Blob, cancelToken: CancelToken): Promise<{result?: any, error?: string}> {
    try {
        const formData = new FormData();
        formData.append("image", blob);
        const response = await axios.post(
            `/api/upload-image/${tenantId}`,
            formData,
            {
                headers: {
                    'Authorization': clientToken,
                    'Content-Type': 'multipart/form-data'
                },
                cancelToken
            }
        );
        
        if (response.status !== 201) {
            return { error: `Failure uploading video. Please try again later. Code: ${response.status}`};
        }

        return { result: response.data };
    } catch (err) {
        return { error: `Failure uploading video. Please try again later.`};
    }
}

export async function fetchContent(clientToken: string, tenantId: string, cancelToken: CancelToken): Promise<{ result?: IFetchEntriesResponse, error?: string }> {
    try {
        const response = await axios.get(
            `/api/fetch-content/${tenantId}`,
            {
                headers: {'Authorization': clientToken },
                cancelToken
            }
        );
        
        if (response.status !== 200) {
            return { error: `Failure fetching clippies. Please try again later. Code: ${response.status}`};
        }

        return { result: response.data };
    } catch (err) {
        return { error: `Failure fetching clippies. Please try again later.`};
    }
}

export async function authConsent(clientToken: string, tenantId: string, cancelToken: CancelToken): Promise<{error?: AxiosError }> {
    try {
        const response = await axios.post(
            '/api/auth-consent',
            { tenantId },
            {
                headers: {'Authorization': clientToken },
                cancelToken
            }
        );
        
        if (response.status !== 200) {
            return { error: response.data };
        }

        return;
    } catch (err) {
        return { error: err };
    }
}

export async function fetchUserInfo(clientToken: string, tenantId: string, cancelToken: CancelToken): Promise<{ result?: IFetchUserResponse, error?: string }> {
    try {
        const response = await axios.get(
            `/api/user-info/${tenantId}`,
            {
                headers: {'Authorization': clientToken },
                cancelToken
            }
        );
        
        if (response.status !== 200) {
            return { error: `Failure fetching videos. Please try again later. Code: ${response.status}`};
        }

        return { result: response.data };
    } catch (err) {
        return { error: `Failure fetching videos. Please try again later.`};
    }
}