import { Avatar, Button } from '@fluentui/react-northstar';
import { AddIcon } from '@fluentui/react-icons-northstar';
import Boop from './boop';

interface IOwnProps {
    image: string,
    name: string,
    owner?: boolean,
    active?: boolean,
    onClick?: () => void,
}

export default function StoryAvatar(props: IOwnProps) {

    return (
        <Boop scale={1.05} timing={200}>
            <Button circular style={{ height: '4rem', padding: 0, minWidth: 0, borderRadius: '2rem' }} onClick={() => props.onClick && props.onClick()}>
                <Avatar
                    image={props.image}
                    name={props.name}
                    size="larger"
                    status={props.owner && {state: "info", icon: <AddIcon styles={{ color: "white" }} /> }}
                    style={{ borderRadius: '2rem', boxShadow: (props.active && '0 0 1pt 3pt #6264A7') }}
                />
            </Button>
        </Boop>
    );
}