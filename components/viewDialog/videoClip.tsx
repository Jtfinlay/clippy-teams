import React from 'react';
import { Box, Button, Flex, FlexItem } from '@fluentui/react-northstar';

interface IOwnProps {
    url: string
}

export default function VideoClip(props: IOwnProps) {
    const videoRef = React.useRef(null);

    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            <video src={props.url} ref={videoRef} autoPlay playsInline loop width="500" height="750"></video>
        </Box>
    );
}