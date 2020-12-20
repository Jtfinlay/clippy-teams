import React from 'react';
import { Box } from '@fluentui/react-northstar';
import { fabric } from 'fabric';
import { VIDEO_STATE } from './videoClip';

const CAMERA_OPTIONS = {
    audio: true,
    video: {
        width: 720,
        height: 1080,
        facingMode: "environment"
    }
};

interface IOwnProps {
    recordState: VIDEO_STATE,
    onPlayback: (blob: Blob) => void,
}

export default function VideoCanvas(props: IOwnProps) {
    const mediaStreamRef = React.useRef(null);
    const recorderRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (!recorderRef.current || !props.recordState) return;

        function startRecording() {
            videoRef.current.muted = true;

            let chunks = [];
            recorderRef.current.ondataavailable = (e) => {
                chunks.push(e.data);
            };
            recorderRef.current.onstop = (e) => {
                let blob = new Blob(chunks);
                let blobUrl = URL.createObjectURL(blob);
                props.onPlayback(blob);

                videoRef.current.src = videoRef.current.srcObject = null;
                videoRef.current.src = blobUrl;
                videoRef.current.muted = false;
            };
            recorderRef.current.start();
        }

        function stopRecording() {
            recorderRef.current.stop();
        }

        function startPreview() {
            videoRef.current.muted = true;
            videoRef.current.src = videoRef.current.srcObject = null;
            videoRef.current.srcObject = mediaStreamRef.current;
        }

        if (props.recordState === VIDEO_STATE.RECORDING) {
            startRecording();
        } else if (props.recordState === VIDEO_STATE.PLAYBACK) {
            stopRecording();
        } else {
            stopRecording();
            startPreview();
        }

    }, [props.recordState]);

    React.useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);

        var webcam = new fabric.Image(videoRef.current, {
            hasControls: false,
            objectCaching: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingFlip: true,
            lockScalingX: true,
            lockScalingY: true,
            lockSkewingX: true,
            lockSkewingY: true,
            hoverCursor: 'default',
        });

        const fetchWebcam = async () => {
            try {
                const localMediaStream = await navigator.mediaDevices.getUserMedia(CAMERA_OPTIONS);

                mediaStreamRef.current = localMediaStream;
                videoRef.current.srcObject = localMediaStream;
                videoRef.current.play(); // Chrome browser needs this to play hidden video
                recorderRef.current = new MediaRecorder(localMediaStream);

                canvas.add(webcam);
                webcam.moveTo(0);
            } catch (e) {
                // block will be hit if user selects "no" for browser "allow webcam access" prompt
                console.error(e);
            }
        };

        fetchWebcam();

        fabric.util.requestAnimFrame(function render() {
            if (!canvas.getContext()) return;
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });

        return () => {
            mediaStreamRef.current.getTracks().forEach(track => {
                if (track.readyState === 'live') {
                    track.stop();
                }
            });
            mediaStreamRef.current = null;
            recorderRef.current = null;
            canvas.clear();
            canvas.dispose();
        };
    }, []);
    
    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            <video ref={videoRef} autoPlay muted playsInline loop width="500" height="750" style={{display: 'none'}}></video>
            <canvas ref={canvasRef} width="500px" height="750px"/>
        </Box>
    );
}