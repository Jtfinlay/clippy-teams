// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { Button, Dialog } from '@fluentui/react-northstar';
import RecordCamera from './RecordCamera';
import './Tab.scss';

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
function Tab() {
    const [context, setContext] = React.useState({});

    React.useEffect(() => {
        microsoftTeams.getContext((context, error) => {
            setContext(context);
        });
    });

    function browseVideo() {
        
    }

    const userName = Object.keys(context).length > 0 ? context['upn'] : "";

    return (
        <div>
            <h3>Hello World!</h3>
            <h1>Congratulations {userName}!</h1>
            <Dialog
                className='clippyDialog'
                content={ <RecordCamera /> }
                trigger={
                    <Button
                        content="Upload clippy"
                        onClick={() => browseVideo()}
                    />
                }
            />
            
            <h3>This is the tab you made :-)</h3>
        </div>
    );
}

export default Tab;