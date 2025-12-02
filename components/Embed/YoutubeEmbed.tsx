import clsx from 'clsx'
import React, {AllHTMLAttributes} from 'react'

interface Props extends Omit<AllHTMLAttributes<HTMLDivElement>, 'children'> {
    embedUrl: string
}

// Встройка YouTube видео в страницу.
export function YoutubeEmbed(props: Props) {

    const {
        embedUrl,
        title,
        className,
        ...otherProps
    } = props

    return (
        <div
            {...otherProps}
            className={clsx('youtube-iframe-container', className)}
        >
            <iframe
                src={embedUrl}
                allowFullScreen
                title={title}
            />
        </div>
    )
}
