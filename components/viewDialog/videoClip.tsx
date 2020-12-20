import React from 'react';
import { Box, Button, Flex, FlexItem } from '@fluentui/react-northstar';
import { CloseIcon} from '@fluentui/react-icons-northstar';

interface IOwnProps {
    onClose: () => void,
    url: string
}

export default function VideoClip(props: IOwnProps) {
    const videoRef = React.useRef(null);

    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
                <video src={props.url} ref={videoRef} autoPlay playsInline loop width="500" height="750"></video>
            </Box>

            <Flex style={{ padding: '10px', top: 0, position: 'absolute', width: 'calc(100% - 20px)' }}>
                <FlexItem push>
                    <Button icon={<CloseIcon />} text iconOnly title="Close" onClick={props.onClose}/>
                </FlexItem>
            </Flex>
        </Box>
    );
}