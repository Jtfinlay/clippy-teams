import { Avatar, Button } from '@fluentui/react-northstar';
import { AddIcon } from '@fluentui/react-icons-northstar';
import Boop from './boop';

interface IOwnProps {
    onClick?: () => void,
}

export default function AddClippyAvatar(props: IOwnProps) {

    return (
        <Boop scale={1.05} timing={200}>
            <Button circular style={{ height: '4rem', padding: 0, minWidth: 0, borderRadius: '2rem' }} onClick={() => props.onClick && props.onClick()}>
                <Avatar
                    image={'./dslr-camera-2.png'}
                    name="Add"
                    size="larger"
                    status={{ state: "info", icon: <AddIcon styles={{ color: "white" }} /> }}
                    style={{ borderRadius: '2rem' }}
                />
            </Button>
        </Boop>
    );
}