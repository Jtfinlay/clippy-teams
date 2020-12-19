import axios from 'axios';

export async function uploadVideo(blob: Blob): Promise<{result?: any, error?: string}> {
    try {
        const formData = new FormData();
        formData.append("video", blob);
        const response = await axios.post(
            '/api/upload-video',
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data' },
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