import React from 'react'
import clsx from 'clsx'
import {ComponentPropsWithModifiableTag, NoteColors} from '../types/Common'

export interface NoteProps extends ComponentPropsWithModifiableTag {
    color?: NoteColors,
}

// Цветной блок с текстом-пояснением.
const Note = ((props: NoteProps, ref: React.ForwardedRef<HTMLElement>) => {
    const {
        className,
        color,
        children,
        tag: Tag = 'p',
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
})

export default React.memo(React.forwardRef<HTMLElement, NoteProps>(Note))
