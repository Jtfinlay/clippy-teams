import React from 'react';
import dynamic from 'next/dynamic';

// Microsoft Teams apis reference the browser, so no SSR.
const AuthStartComponent = dynamic(
    () => import('../components/auth-start'),
    { ssr: false}
);

export default function AuthStart() {

    return (
        <AuthStartComponent/>
    );
}
