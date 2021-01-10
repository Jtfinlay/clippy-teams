import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Flex, FlexItem } from '@fluentui/react-northstar';
import { CallRecordingIcon, ChevronEndIcon, CloseIcon, PauseThickIcon, SendIcon } from '@fluentui/react-icons-northstar';
import axios, { CancelTokenSource } from 'axios';
import { uploadVideo } from '../../utils/api';

// VideoCanvas uses webcam, which needs browser apis
const VideoCanvas = dynamic(
    () => import('./videoCanvas'),
    { ssr: false}
);

export enum VIDEO_STATE {
    PREVIEW = "preview",
    RECORDING = "recording",
    PLAYBACK = "playback"
}

export const SEGMENT_MAX_LENGTH = 10000;

interface IOwnProps {
    tenantId: string,
    getAuthToken: () => Promise<string>,
    success: () => void,
    close: () => void,
    nextView: () => void,
}

export default function VideoClip(props: IOwnProps) {
    const timerRef = React.useRef(null);
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());
    const [videoState, setVideoState] = React.useState(VIDEO_STATE.PREVIEW);
    const [progress, setProgress] = React.useState(0);
    const [blob, setBlob] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState('');

    const showPrimaryAction = !uploading && (videoState === VIDEO_STATE.PREVIEW || videoState === VIDEO_STATE.RECORDING);

    async function onSubmitVideo() {
        if (uploading) return;
        
        setUploading(true);
        setError('');

        const authToken = await props.getAuthToken();
        const response = await uploadVideo(authToken, props.tenantId, blob, cancelToken.current.token);
        if (response.error) {
            setError(response.error);
        } else {
            // do something animated to show success
            props.success();
        }

        setUploading(false);
    }

    function stopRecording() {
        setProgress(0);
        clearInterval(timerRef.current);
        setVideoState(VIDEO_STATE.PLAYBACK);
    }

    function onRecordAction() {
        setVideoState(r => {
            switch (r) {
                case VIDEO_STATE.PREVIEW: {
                    timerRef.current = setInterval(() => {
                        setProgress(p => {
                            const result = p + 100;
                            if (result >= SEGMENT_MAX_LENGTH) {
                                stopRecording();
                            }
                            return result;
                        });
                    }, 100);
                    return VIDEO_STATE.RECORDING;
                }
                case VIDEO_STATE.RECORDING: {
                    setProgress(0);
                    clearInterval(timerRef.current);
                    return VIDEO_STATE.PLAYBACK;
                }
            }
        });
    }

    React.useEffect(() => {
        const token = cancelToken.current;
        return () => {
            token.cancel();
            clearInterval(timerRef.current);
        }
    }, [cancelToken]);

    return (
        <Box style={{ width: '100%', display: 'inline-block', position: 'relative'}} >
            <VideoCanvas recordState={videoState} onPlayback={blob => setBlob(blob)} />

            <Flex style={{ padding: '10px', top: 0, position: 'absolute', width: 'calc(100% - 20px)' }}>
                {videoState === VIDEO_STATE.PLAYBACK && !uploading && (
                    <Button icon={<SendIcon/>} content={"Send Clip"} onClick={() => onSubmitVideo()} />
                )}
                <FlexItem push>
                    <Button icon={<CloseIcon />} text iconOnly title="Close" onClick={props.close}/>
                </FlexItem>
            </Flex>

            <Flex style={{ padding: '10px', bottom: 50, position: 'absolute', width: 'calc(100% - 20px)' }}>
                <FlexItem push>
                    <Button icon={<ChevronEndIcon/>} iconOnly title="Next" onClick={() => props.nextView()}/>
                </FlexItem>
            </Flex>

            <Flex hAlign="center" style={{ padding: '10px', bottom: '10%', position: 'absolute', width: 'calc(100% - 20px)' }}>
                {showPrimaryAction && (
                    <Button
                        icon={videoState === VIDEO_STATE.PREVIEW ? <CallRecordingIcon /> : <PauseThickIcon />}
                        iconOnly
                        title="Record/Stop"
                        onClick={() => onRecordAction()}
                    />
                )}
            </Flex>
        </Box>
    );
}