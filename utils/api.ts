import axios from 'axios';

export function uploadVideo(blob: Blob): Promise<{result: any, error: string}> {
    try {
        const response = axios.post('/api/upload-video', { blob });
        if (response.status !== 200) {
            return { error: `Failure updating exchange. Please try again later. Code: ${response.status}`};
        }

        return { result: response.data };
    } catch (err) {
        return { error: `Failure updating exchange. Please try again later.`};
    }
}