import React from 'react';
import CreateContent from './createDialog/createContent';
import ViewContent from './viewDialog/viewContent';
import { IFetchUserResponse } from '../lib/storage';

interface IOwnProps {
    success: () => void,
    close: () => void,
    users: IFetchUserResponse[],
    localUserId: string,
    defaultIndex: string
}

export default function ClipView(props: IOwnProps) {
    const [index, setIndex] = React.useState(-1);

    React.useEffect(() => {
        setIndex(indices.findIndex(v => v === props.defaultIndex));
    }, []);

    // Build a list of views [create, ...users]
    const indices = ['create'];

    props.users.filter(u => Boolean(u.entries.length)).forEach(u => {
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
                        success={props.success}
                        close={() => props.close()}
                        nextView={() => nextView()}
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
