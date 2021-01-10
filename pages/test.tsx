import React from 'react';
import dynamic from 'next/dynamic';

// Microsoft Teams apis reference the browser, so no SSR.
const TestComponent = dynamic(
    () => import('../components/testComponent'),
    { ssr: false}
);

export default function Test() {

    return (
        <TestComponent/>
    );
}
