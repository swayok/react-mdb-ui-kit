import clsx from 'clsx'
import {
    MorphingHtmlComponentProps,
    NoteColors,
} from '../../types'

export interface NoteProps extends MorphingHtmlComponentProps {
    color?: NoteColors
}

// Цветной блок с текстом-пояснением.
export function Note(props: NoteProps) {
    const {
        className,
        color,
        children,
        tag: Tag = 'p',
        ref,
        ...otherProps
    } = props

    const classes = clsx(
        'note',
        color ? 'note-' + color : null,
        className
    )

    return (
        <Tag
            className={classes}
            ref={ref}
            {...otherProps}
        >
            {children}
        </Tag>
    )
}
