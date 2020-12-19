import { Avatar, Flex } from '@fluentui/react-northstar';

export default function AvatarList() {

    const users = [
        {
            image: '/james.jpg',
            name: 'James',
        },
        {
            image: '/matt.jpg',
            name: 'Matt',
        },
        {
            image: '/jerry.png',
            name: 'Jerry',
        },
    ]

    return (
        <Flex gap="gap.small">
            {users.map((u, i) => (
                <Avatar
                    key={i}
                    {...u}
                    size="larger"
                />
            ))}
        </Flex>
    )
}