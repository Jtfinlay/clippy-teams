import React from 'react';
import { Box, Button, Dialog, Flex } from '@fluentui/react-northstar';
import TextClip from './textClip';

export default function DialogViewer() {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(1);

    const mediaOptions = [
        {
            component: <TextClip onClose={() => setOpen(false)} />,
            title: "Text"
        },
        {
            component: <TextClip onClose={() => setOpen(false)} />,
            title: "Record"
        }
    ];

    return (
        <Dialog
            style={{ width: '500px', height: '782px', padding: 0, display: 'flex', overflowY: 'hidden' }}
            open={open}
            onOpen={() => setOpen(true)}
            trigger={<Button content="Make a clippy"/>}
            content={
                <Flex column style={{width: '500px', height: '750px'}}>
                    <Box style={{ height: '100%' }}>
                        {mediaOptions[index].component}
                    </Box>
                    <Flex hAlign="center" gap="gap.small">
                        {mediaOptions.map((media, i) => (
                            <Button
                                text
                                key={i}
                                onClick={() => setIndex(i)}
                                content={media.title}
                                primary={i === index}
                            />
                        ))}
                    </Flex>
                </Flex>
            }
        />
    );
}