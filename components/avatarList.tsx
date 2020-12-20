import React from 'react';
import { Button, Flex, Loader, Text } from '@fluentui/react-northstar';
import { SyncIcon } from '@fluentui/react-icons-northstar'
import axios, { CancelTokenSource } from 'axios';
import { fetchVideos } from '../utils/api';
import StoryAvatar from './storyAvatar';
import Boop from './boop';

const avatarSize = { width: '4rem', height: '4rem' };

interface IOwnProps {
    createClippy: () => void,
    viewUserClippy: (userId: string) => void
}

export default function AvatarList(props: IOwnProps) {
    const [fetching, setFetching] = React.useState(false);
    const [error, setError] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const cancelToken = React.useRef<CancelTokenSource>(axios.CancelToken.source());

    async function refresh() {
        if (fetching) return;

        setFetching(true);
        const response = await fetchVideos(cancelToken.current.token);
        if (response.error) {
            setError(response.error);
        } else {
            setUsers(response.result!.users);
        }

        setFetching(false);
    }

    React.useEffect(() => {
        refresh();
    }, []);

    React.useEffect(() => {
        const token = cancelToken.current;
        return () => {
            token.cancel();
        }
    }, [cancelToken]);

    const userData = users.map(u => ({
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

                {fetching && <Loader style={avatarSize} />}
                {!fetching && (
                    <Boop scale={1.05} timing={200}>
                        <Button style={avatarSize} circular icon={<SyncIcon/>} onClick={() => refresh()}/>
                    </Boop>
                )}
            </Flex>
            <Text error content={error}/>
        </Flex>
    )
}