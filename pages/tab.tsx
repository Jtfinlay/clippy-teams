import React from 'react';
import dynamic from 'next/dynamic';
import Home from '../components/home';

// Microsoft Teams apis reference the browser, so no SSR.
const TeamsWrapper = dynamic(
    () => import('../components/teamsWrapper'),
    { ssr: false}
);

export default function Tab() {
    return (
        <TeamsWrapper>
            {/* These props are set by the wrapper. TODO: Is there a way in typescript to not set props here? */}
            <Home tenantId='' getAuthToken={() => Promise.resolve('')}/>
        </TeamsWrapper>
    );
}
