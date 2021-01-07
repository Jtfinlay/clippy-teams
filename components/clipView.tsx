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

    props.users.filter(u => u.id !== props.localUserId).forEach(u => {
        indices.push(u.id);
    });

    function nextView() {
        if (index+1 >= indices.length) {
            props.close();
            return;
        }

        setIndex(i => i+1);
    }

    function renderContent() {
        switch (indices[index]) {
            case 'create':
                return (
                    <CreateContent
                        close={() => props.close()}
                        nextView={() => nextView()}
                    />
                );
            case 'me': 
                return (
                    <ViewContent
                        close={props.close}
                        user={localUser}
                        prevUser={() => setIndex(i => i-1)}
                        nextUser={() => nextView()}
                    />
                );
            default:
                return (
                    <ViewContent
                        close={props.close}
                        user={props.users.find(u => u.id === indices[index])}
                        prevUser={() => setIndex(i => i-1)}
                        nextUser={() => nextView()}
                    />
                )
        }
    }

    // Return current view
    return Boolean(index >= 0) ? renderContent() : null;
}
