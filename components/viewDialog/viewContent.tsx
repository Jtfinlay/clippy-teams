import React from 'react';
import { Box, Button, Flex, FlexItem } from '@fluentui/react-northstar';
import { ChevronStartIcon, ChevronEndIcon, CloseIcon} from '@fluentui/react-icons-northstar';
import VideoClip from './videoClip';
import { IFetchUserResponse } from '../../lib/storage';

interface IOwnProps {
    close: () => void,
    users: IFetchUserResponse[],
    activeUser: string
}

export default function ViewContent(props: IOwnProps) {
    const [clipIndex, setClipIndex] = React.useState(0);
    const user = props.users?.find(u => u.id === props.activeUser);

    function nextVideo() {
        if (clipIndex+1 > user.entries.length-1) {
            // todo - go to next user if possible
            props.close();
            return;
        }

        setClipIndex(i => i+1);
    }

    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            <VideoClip url={user.entries[clipIndex].sasUrl} />

            <Flex style={{ padding: '10px', bottom: 50, position: 'absolute', width: 'calc(100% - 20px)' }}>
                {clipIndex > 0 && <Button icon={<ChevronStartIcon/>} iconOnly title="Previous"/>}
                <FlexItem push>
                    <Button icon={<ChevronEndIcon/>} iconOnly title="Next" onClick={() => nextVideo()}/>
                </FlexItem>
            </Flex>

            <Flex style={{ padding: '10px', top: 0, position: 'absolute', width: 'calc(100% - 20px)' }}>
                <FlexItem push>
                    <Button icon={<CloseIcon />} text iconOnly title="Close" onClick={props.close}/>
                </FlexItem>
            </Flex>
        </Box>
    );
}