import React from 'react';
import { Box, Button, Flex, FlexItem } from '@fluentui/react-northstar';
import { CloseIcon, SendIcon } from '@fluentui/react-icons-northstar';
import { fabric } from 'fabric';

interface IOwnProps {
    onClose: () => void,
}

export default function TextClip(props: IOwnProps) {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);

        canvas.setBackgroundColor('#698ec6', () => {});
        const textbox = new fabric.Textbox("What's on your mind?", {
            left: 100,
            top: 300,
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
                <canvas width="500px" height="750px" ref={canvasRef}/>
            </Box>
            <Flex style={{ padding: '10px', top: 0, position: 'absolute', width: 'calc(100% - 20px)' }}>
                <Button icon={<SendIcon/>} content={"Send Clip"} />
                <FlexItem push>
                    <Button icon={<CloseIcon />} text iconOnly title="Close" onClick={props.onClose}/>
                </FlexItem>
            </Flex>
        </Box>
    );
}