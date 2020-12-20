import React from 'react';
import { Box, Button, Flex } from '@fluentui/react-northstar';
import TextClip from './textClip';
import VideoClip from './videoClip';

interface IOwnProps {
    close: () => void
}

export default function CreateContent(props: IOwnProps) {
    const [index, setIndex] = React.useState(1);

    const mediaOptions = [
        {
            component: <TextClip onClose={props.close} />,
            title: "Text"
        },
        {
            component: <VideoClip onClose={props.close} />,
            title: "Record"
        }
    ];

    return (
        <>
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
        </>
    );
}