import React from 'react';
import dynamic from 'next/dynamic';

// Microsoft Teams apis reference the browser, so no SSR.
const Home = dynamic(
    () => import('../components/home'),
    { ssr: false}
);

const TeamsWrapper = dynamic(
    () => import('../components/teamsWrapper'),
    { ssr: false}
);

export default function Index() {
    return (
        <TeamsWrapper>
            <Home/>
        </TeamsWrapper>
    );
}