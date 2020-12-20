import React from 'react';
import { Box, Button, Flex } from '@fluentui/react-northstar';
import VideoClip from './videoClip';
import { IFetchUserResponse } from '../../lib/storage';

interface IOwnProps {
    close: () => void,
    users: IFetchUserResponse[],
    activeUser: string
}

export default function ViewContent(props: IOwnProps) {
    const user = props.users?.find(u => u.id === props.activeUser);

    return (
        <VideoClip onClose={props.close} url={user.entries[0].sasUrl} />
    );
}