import React from 'react';
import { Avatar, Box, Button, Flex, FlexItem, Text } from '@fluentui/react-northstar';
import { ChevronStartIcon, ChevronEndIcon, CloseIcon} from '@fluentui/react-icons-northstar';
import Clippy from './clippy';
import { IFetchUserResponse } from '../../lib/storage';

interface IOwnProps {
    close: () => void,
    user: IFetchUserResponse,
    nextUser: () => void,
    prevUser: () => void,
}

export default function ViewContent(props: IOwnProps) {
    const [clipIndex, setClipIndex] = React.useState(0);

    function prevVideo() {
        if (clipIndex === 0) {
            props.prevUser();
            return;
        }

        setClipIndex(i => i-1);
    }

    function nextVideo() {
        if (clipIndex+1 >= props.user.entries.length) {
            props.nextUser();
            return;
        }

        setClipIndex(i => i+1);
    }

    const clip = props.user.entries[clipIndex];

    return (
        <Box style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative'}} >
            <Clippy url={clip.sasUrl} type={clip.fileType}/>

            <Flex gap="gap.small" style={{ padding: '10px', top: 0, position: 'absolute', width: '100%', background: 'linear-gradient(#3d3d3e, #3d3d3e00)' }}>
                <Avatar image={props.user.photoUrl} name={props.user.displayName} size="large" />
                <Flex column>
                    <Text color="white" weight="bold" content={props.user.displayName} />
                    <Text color="white" content={props.user.userPrincipalName} />
                </Flex>

                <FlexItem push>
                    <Button icon={<CloseIcon />} text iconOnly title="Close" onClick={props.close} style={{ color: 'white' }}/>
                </FlexItem>
            </Flex>


            <Flex style={{ padding: '10px', bottom: 50, position: 'absolute', width: 'calc(100% - 20px)' }}>
                <Button icon={<ChevronStartIcon/>} iconOnly title="Previous" onClick={() => prevVideo()}/>
                <FlexItem push>
                    <Button icon={<ChevronEndIcon/>} iconOnly title="Next" onClick={() => nextVideo()}/>
                </FlexItem>
            </Flex>
        </Box>
    );
}