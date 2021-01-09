import React from 'react';
import { Button, Flex, Loader, Text } from '@fluentui/react-northstar';
import { SyncIcon } from '@fluentui/react-icons-northstar'
import StoryAvatar from './storyAvatar';
import Boop from './boop';
import { IFetchUserResponse } from '../lib/storage';
import AddClippyAvatar from './addClippyAvatar';

const avatarSize = { width: '4rem', height: '4rem' };

interface IOwnProps {
    addClippy: () => void,
    viewUserClippy: (userId: string) => void,
    refresh: () => void,
    users: IFetchUserResponse[],
    error: string,
    fetching: boolean,
    localUserId: string
}

export default function AvatarList(props: IOwnProps) {

    const userData = props.users.map(u => ({
        id: u.id,
        image: u.photoUrl,
        name: u.displayName,
    }));

    const localUser = props.users.find(u => u.id === props.localUserId);

    function renderLocalUserActions() {
        if (Boolean(localUser?.entries.length)) {
            return (
                <AddClippyAvatar onClick={() => props.addClippy()} />
            );
        } else {
            return (
                <StoryAvatar owner image={localUser?.photoUrl} name={localUser?.displayName} onClick={() => props.addClippy}/>
            );
        }
    }

    return (
        <Flex column>
            <Flex gap="gap.small">
                
                {renderLocalUserActions()}

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