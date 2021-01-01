import React from 'react';
import dynamic from 'next/dynamic';

// Microsoft Teams apis reference the browser, so no SSR.
const AuthEndComponent = dynamic(
    () => import('../components/auth-end'),
    { ssr: false}
);

export default function AuthEnd() {

    return (
        <AuthEndComponent/>
    )
}
