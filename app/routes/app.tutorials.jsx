import React from 'react';
import {
    Page,
    Layout,
    Card,
    Text,
    MediaCard,
    VideoThumbnail,
    ButtonGroup,
    Button,
    Icon,
} from '@shopify/polaris';
import { ArrowLeftIcon } from '@shopify/polaris-icons';

export default function Tutorials() {

    const videos = [
        {
            title: 'How to translate Rapi Bundle in multiple languages for FREE [TUTORIAL]',
            thumbnailUrl: 'https://app.rapibundle.com/images/tutorials/thumb1.webp',
            videoLength: 180,
        },
        {
            title: 'How to translate Rapi Bundle in multiple languages for FREE [TUTORIAL]',
            thumbnailUrl: 'https://app.rapibundle.com/images/tutorials/thumb1.webp',
            videoLength: 180,
        },
        {
            title: 'How to translate Rapi Bundle in multiple languages for FREE [TUTORIAL]',
            thumbnailUrl: 'https://app.rapibundle.com/images/tutorials/thumb1.webp',
            videoLength: 180,
        },
        {
            title: 'How to translate Rapi Bundle in multiple languages for FREE [TUTORIAL]',
            thumbnailUrl: 'https://app.rapibundle.com/images/tutorials/thumb1.webp',
            videoLength: 180,
        }
    ]

    return (
        <Page
            backAction={{ content: 'Video Tutorials', icon: ArrowLeftIcon }}
            title="Video Tutorials"
        >
            <Layout>
                <Layout.Section>
                    {videos.map((video, index) => (
                        <MediaCard
                            key={index}
                            title={video.title}
                            primaryAction={{
                                content: 'Watch the Video',
                                onAction: () => { },
                            }}
                            secondaryAction={{
                                content: 'Read the Blog',
                                onAction: () => { },
                            }}
                            description=""
                        >
                            <VideoThumbnail
                                videoLength={180}
                                thumbnailUrl={video.thumbnailUrl}
                                onClick={() => { }}
                            />
                        </MediaCard>
                    ))}

                </Layout.Section>
            </Layout>
        </Page>
    );
}