import React from 'react';
import { Dialog, Flex } from '@fluentui/react-northstar';
import useMobileWidth from './hooks/useMobileWidth';

interface IOwnProps {
    open: boolean,
    children: JSX.Element
}

export default function ClipDialog(props: IOwnProps) {
    const isMobile = useMobileWidth();

    const styles = isMobile 
        ? { width: '100%', height: '100%' }
        : { width: '500px', height: '782px' };

    return (
        <Dialog
            style={{ ...styles, padding: 0, display: 'flex', overflowY: 'hidden', background: 'black' }}
            open={props.open}
            content={(
                <Flex column style={styles}>
                    {props.children}
                </Flex>
            )}
        />
    );
}