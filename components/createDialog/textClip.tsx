import React from 'react';
import { Box, Button, Flex, FlexItem } from '@fluentui/react-northstar';
import { CloseIcon, SendIcon } from '@fluentui/react-icons-northstar';
import axios, { CancelTokenSource } from 'axios';
import { fabric } from 'fabric';
import { uploadImage } from '../../utils/api';
import useDisplayDimensions from '../hooks/useDisplayDimensions';

interface IOwnProps {
    tenantId: string,
    getAuthToken: () => Promise<string>,
    success: () => void,
    close: () => void,
    nextView: () => void,
}

export default function TextClip(props: IOwnProps) {
    const canvasRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(false);
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());
    const [width, height] = useDisplayDimensions();
    const [error, setError] = React.useState('');

    async function onSubmitImage() {
        if (uploading) return;

        setUploading(true);
        setError('');

        const authToken = await props.getAuthToken();

        const blob = await new Promise<any>((res, rej) => {
            canvasRef.current!.toBlob((blob) => {
                res(blob);
            });
        });

        const response = await uploadImage(authToken, props.tenantId, blob, cancelToken.current.token);
        if (response.error) {
            setError(response.error);
        } else {
            // do something animated to show success
            props.success();
        }

        setUploading(false);
    }

    React.useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);

        canvas.setBackgroundColor('#698ec6', () => {});
        const textbox = new fabric.Textbox("What's on your mind?", {
            left: (width-300)/2,
            top: height/2-100,
            width: 300,
            fontSize: 28,
            fill: '#fff',
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: 800,
            textAlign: 'center',
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false
        });

        textbox.set('shadow', new fabric.Shadow("0px 0px 10px rgba(0, 0, 0, 1)"));

        canvas.add(textbox);

        return () => {
            canvas.clear();
            canvas.dispose();
        };
    }, []);
    
    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
                <canvas width={width} height={height} ref={canvasRef}/>
            </Box>
            <Flex style={{ padding: '10px', top: 0, position: 'absolute', width: 'calc(100% - 20px)' }}>
                <Button icon={<SendIcon/>} content={"Send Clip"} onClick={() => onSubmitImage()}/>
                <FlexItem push>
                    <Button icon={<CloseIcon />} text iconOnly title="Close" onClick={props.close}/>
                </FlexItem>
            </Flex>
        </Box>
    );
}