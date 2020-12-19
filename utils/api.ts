import axios from 'axios';

export async function uploadVideo(blob: Blob): Promise<{result: any, error: string}> {
    try {
        debugger;
        const formData = new FormData();
        formData.append("video", "test");
        formData.append("size", blob.size);
        const response = await axios.post(
            '/api/upload-video',
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data' },
            }
        );
        
        if (response.status !== 200) {
            return { error: `Failure updating exchange. Please try again later. Code: ${response.status}`};
        }

        return { result: response.data };
    } catch (err) {
        return { error: `Failure updating exchange. Please try again later.`};
    }
}