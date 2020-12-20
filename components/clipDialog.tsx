import React from 'react';
import { Dialog, Flex } from '@fluentui/react-northstar';

interface IOwnProps {
    open: boolean,
    children: JSX.Element
}

export default function ClipDialog(props: IOwnProps) {
    return (
        <Dialog
            style={{ width: '500px', height: '782px', padding: 0, display: 'flex', overflowY: 'hidden' }}
            open={props.open}
            content={(
                <Flex column style={{width: '500px', height: '750px'}}>
                    {props.children}
                </Flex>
            )}
        />
    );
}