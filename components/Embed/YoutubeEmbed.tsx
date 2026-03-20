import clsx from 'clsx'
import type {HtmlComponentProps} from '../../types'

interface Props extends Omit<HtmlComponentProps<HTMLDivElement>, 'children'> {
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
