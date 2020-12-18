import React from 'react';
import { Box } from '@fluentui/react-northstar';
import RecordRTC from 'recordrtc';
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

const _original_initHiddenTextarea = fabric.IText.prototype.initHiddenTextarea;
fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {
    // fix for : IText not editable when canvas is in a modal on chrome
    // https://github.com/fabricjs/fabric.js/issues/5126
    initHiddenTextarea: function () {
        _original_initHiddenTextarea.call(this);
        this.canvas.wrapperEl.appendChild(this.hiddenTextarea);
    }
});

interface IOwnProps {
    recordState: VIDEO_STATE
}

export default function VideoCanvas(props: IOwnProps) {
    const mediaStreamRef = React.useRef(null);
    const rtcRecorderRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (!rtcRecorderRef.current || !props.recordState) return;

        function startRecording() {
            videoRef.current.muted = true;
            rtcRecorderRef.current.startRecording();
        }

        function stopRecording() {
            rtcRecorderRef.current.stopRecording();
        }

        function startPlayback() {
            rtcRecorderRef.current.stopRecording(() => {
                let blob = rtcRecorderRef.current.getBlob();

                videoRef.current.src = videoRef.current.srcObject = null;
                videoRef.current.src = URL.createObjectURL(blob);
                videoRef.current.muted = false;
            });
        }

        function startPreview() {
            videoRef.current.muted = true;
            videoRef.current.srcObject = mediaStreamRef.current;
            videoRef.current.src = videoRef.current.srcObject = null;
        }

        if (props.recordState === VIDEO_STATE.RECORDING) {
            startRecording();
        } else if (props.recordState === VIDEO_STATE.PLAYBACK) {
            startPlayback();
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
                rtcRecorderRef.current = new RecordRTC(localMediaStream, {
                    mimeType: 'video/webm',
                    type: 'video'
                });

                canvas.add(webcam);
                webcam.moveTo(0);
            } catch (e) {
                // block will be hit if user selects "no" for browser "allow webcam access" prompt
            }
        };

        fetchWebcam();

        fabric.util.requestAnimFrame(function render() {
            if (!canvas.getContext()) return;
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });

        return () => {
            videoRef.current && videoRef.current.srcObject.getTracks().forEach(track => {
                if (track.readyState === 'live') {
                    track.stop();
                }
            });
            mediaStreamRef.current = null;
            rtcRecorderRef.current = null;
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