import clsx from 'clsx'
import {
    AnyRefObject,
    ComponentPropsWithModifiableTag,
    NoteColors,
} from 'swayok-react-mdb-ui-kit/types/Common'

export interface NoteProps extends ComponentPropsWithModifiableTag {
    color?: NoteColors,
    ref?: AnyRefObject<HTMLElement>
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

/** @deprecated */
export default Note
