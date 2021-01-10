import React from 'react';
import dynamic from 'next/dynamic';
import Home from '../components/home';

// Login apis reference the browser, so no SSR.
const WebWrapper = dynamic(
    () => import('../components/webWrapper'),
    { ssr: false}
);

export default function Web() {
    return (
        <WebWrapper>
            {/* These props are set by the wrapper. TODO: Is there a way in typescript to not set props here? */}
            <Home tenantId='' getAuthToken={() => Promise.resolve('')}/>
        </WebWrapper>
    );
}
