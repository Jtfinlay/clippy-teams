import React from 'react';
import { Avatar, Button, Flex, Loader } from '@fluentui/react-northstar';
import { SyncIcon } from '@fluentui/react-icons-northstar'
import axios, { CancelTokenSource } from 'axios';
import classNames from 'classnames';
import { fetchVideos } from '../utils/api';

const avatarSize = { width: '64px', height: '64px' };

export default function AvatarList() {
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
        image: {
            src: '/matt.jpg',
            style: { boxShadow: '0 0 1pt 3pt #6264A7' }
        },
        name: 'Matt',
    }));

    return (
        <Flex gap="gap.small">
            <Avatar
                image='./james.jpg'
                name="James"
                size="larger"
            />

            {userData.map((u, i) => (
                <Avatar
                    key={i}
                    {...u}
                    size="larger"
                />
            ))}

            {fetching && <Loader style={avatarSize} />}
            {!fetching && <Button style={avatarSize} circular icon={<SyncIcon/>} onClick={() => refresh()}/>}
        </Flex>
    )
}