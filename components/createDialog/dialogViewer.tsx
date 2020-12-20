import React from 'react';
import { Box, Button, Dialog, Flex } from '@fluentui/react-northstar';
import TextClip from './textClip';
import VideoClip from './videoClip';

interface IOwnProps {
    open: boolean,
    setOpen: (open: boolean) => void
}

export default function DialogViewer(props: IOwnProps) {
    const [index, setIndex] = React.useState(1);

    const mediaOptions = [
        {
            component: <TextClip onClose={() => props.setOpen(false)} />,
            title: "Text"
        },
        {
            component: <VideoClip onClose={() => props.setOpen(false)} />,
            title: "Record"
        }
    ];

    return (
        <Dialog
            style={{ width: '500px', height: '782px', padding: 0, display: 'flex', overflowY: 'hidden' }}
            open={props.open}
            onOpen={() => props.setOpen(true)}
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