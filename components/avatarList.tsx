import React from 'react';
import { Button, Flex, Loader, Text } from '@fluentui/react-northstar';
import { SyncIcon } from '@fluentui/react-icons-northstar'
import StoryAvatar from './storyAvatar';
import Boop from './boop';
import { IFetchUserResponse } from '../lib/storage';

const avatarSize = { width: '4rem', height: '4rem' };

interface IOwnProps {
    createClippy: () => void,
    viewUserClippy: (userId: string) => void,
    refresh: () => void,
    users: IFetchUserResponse[],
    error: string,
    fetching: boolean
}

export default function AvatarList(props: IOwnProps) {

    const userData = props.users.map(u => ({
        id: u.id,
        image: '/matt.jpg',
        name: 'Matt',
    }));

    return (
        <Flex column>
            <Flex gap="gap.small">
                <StoryAvatar owner image="/james.jpg" name="James" onClick={props.createClippy}/>

                {userData.map((u, i) => (
                    <StoryAvatar key={i} active {...u} onClick={() => props.viewUserClippy(u.id)} />
                ))}

                {props.fetching && <Loader style={avatarSize} />}
                {!props.fetching && (
                    <Boop scale={1.05} timing={200}>
                        <Button style={avatarSize} circular icon={<SyncIcon/>} onClick={props.refresh}/>
                    </Boop>
                )}
            </Flex>
            <Text error content={props.error}/>
        </Flex>
    )
}