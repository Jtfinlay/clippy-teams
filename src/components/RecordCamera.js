import React from 'react';
import useUserMedia from '../hooks/useUserMedia';
import { Provider } from '@fluentui/react-northstar';

const CAPTURE_OPTIONS = {
    audio: true,
    video: {
        width: {
            ideal: 720
        },
        height: {
            ideal: 1080
        },
        facingMode: "user"
    }
};

function RecordCamera() {
    const [isRecording, setIsRecording] = React.useState(false);
    const videoRef = React.useRef(null);

    const mediaStream = useUserMedia(CAPTURE_OPTIONS);

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function startRecording() {
        setIsRecording(true);
    }


    return (
        <div style={styles.container}>
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={styles.video}
            />
        </div>
    )
}

const styles = {
    container: {
        maxHeight: '100%',
    },
    video: {
        maxWidth: '100%',
        maxHeight: '100%',
    }
}

export default RecordCamera;