import axios, { CancelToken } from 'axios';
import { IFetchEntriesResponse } from '../lib/storage';

export async function uploadVideo(blob: Blob, cancelToken: CancelToken): Promise<{result?: any, error?: string}> {
    try {
        const formData = new FormData();
        formData.append("video", blob);
        const response = await axios.post(
            '/api/upload-video',
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data' },
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

export async function fetchVideos(cancelToken: CancelToken): Promise<{ result?: IFetchEntriesResponse, error?: string }> {
    try {
        const response = await axios.get(
            '/api/fetch-videos',
            {
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