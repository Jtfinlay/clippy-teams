import { Box, Button } from '@fluentui/react-northstar';
import React from 'react';
import ClipDialog from './clipDialog';
import ClipView from './clipView';

export default function TestComponent() {
    const [dialogOpen, setDialogOpen] = React.useState(false);

    return (
        <Box>
            <Button content="Click me" onClick={() => setDialogOpen(true) }/>
            <ClipDialog open={dialogOpen}>
                <ClipView
                    tenantId='tid'
                    getAuthToken={() => Promise.resolve('') }
                    success={() => { setDialogOpen(false); }}
                    close={() => setDialogOpen(false)}
                    users={[]}
                    localUserId={'ff'}
                    defaultIndex={'create'}
                />
            </ClipDialog>
        </Box>
    );
}
