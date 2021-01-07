import React from 'react';
import { Box } from '@fluentui/react-northstar';
import { FileType } from '../../lib/schema';

interface IOwnProps {
    url: string,
    type: FileType
}

export default function Clippy(props: IOwnProps) {

    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            {props.type === FileType.VIDEO && <video src={props.url} autoPlay playsInline loop width="500" height="750"></video>}
            {props.type === FileType.IMAGE && <img src={props.url} width="500" height="750"/>}
        </Box>
    );
}