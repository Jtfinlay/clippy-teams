import React from 'react';
import CreateContent from './createDialog/createContent';
import ViewContent from './viewDialog/viewContent';
import { IFetchUserResponse } from '../lib/storage';

interface IOwnProps {
    close: () => void,
    users: IFetchUserResponse[],
    localUserId: string,
    defaultIndex: string
}

export default function ClipView(props: IOwnProps) {
    const [index, setIndex] = React.useState(-1);

    const localUser = props.users?.find(u => u.id === props.localUserId);

    React.useEffect(() => {
        setIndex(indices.findIndex(v => v === props.defaultIndex));
    }, []);

    // Build a list of views [create, localUserVideo, ...otherUsers]
    const indices = ['create'];
    if (Boolean(localUser.entries.length)) {
        indices.push('me');
    }

    props.users.forEach(u => {
        indices.push(u.id);
    });

    function renderContent() {
        switch (indices[index]) {
            case 'create':
                return (
                    <CreateContent
                        close={() => props.close()}
                        nextView={() => setIndex(i => i+1)}
                    />
                );
            case 'me': 
                return (
                    <ViewContent
                        close={props.close}
                        user={localUser}
                        prevUser={() => setIndex(i => i-1)}
                        nextUser={() => setIndex(i => i+1)}
                    />
                );
            default:
                return (
                    <ViewContent
                        close={props.close}
                        user={props.users.find(u => u.id === indices[index])}
                        prevUser={() => setIndex(i => i-1)}
                        nextUser={() => setIndex(i => i+1)}
                    />
                )
        }
    }

    // Return current view
    return Boolean(index >= 0) ? renderContent() : null;
}
