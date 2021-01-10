import React from 'react';
import { Box } from '@fluentui/react-northstar';
import { FileType } from '../../lib/schema';
import useDisplayDimensions from '../hooks/useDisplayDimensions';

interface IOwnProps {
    url: string,
    type: FileType
}

export default function Clippy(props: IOwnProps) {
    const [width, height] = useDisplayDimensions();

    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            {props.type === FileType.VIDEO && <video src={props.url} autoPlay playsInline loop width={width} height={height} style={{borderRadius: '5px'}}></video>}
            {props.type === FileType.IMAGE && <img src={props.url} width={width} height={height} style={{borderRadius: '5px'}}/>}
        </Box>
    );
}