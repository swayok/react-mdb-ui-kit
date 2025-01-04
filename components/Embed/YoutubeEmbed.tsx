import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'

interface Props extends Omit<AllHTMLAttributes<HTMLDivElement>, 'children'> {
    embedUrl: string;
}

// Встройка YouTube видео в страницу.
function YoutubeEmbed(props: Props) {

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

export default React.memo(YoutubeEmbed)
