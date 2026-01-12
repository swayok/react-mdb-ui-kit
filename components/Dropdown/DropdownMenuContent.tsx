import clsx from 'clsx'
import {
    HtmlComponentProps,
    MergedComponentProps,
} from '../../types'
import {DropdownMenuContentProps} from './DropdownTypes'

// Выпадающее меню (отображение).
export function DropdownMenuContent<
    InjectedComponentProps extends object = HtmlComponentProps<HTMLDivElement>,
>(props: MergedComponentProps<DropdownMenuContentProps, InjectedComponentProps>) {

    const {
        className,
        shadow,
        tag: Tag = 'div',
        variant,
        maxHeight,
        width,
        minWidth,
        maxWidth,
        textNowrapOnItems,
        style = {},
        fillContainer,
        children,
        ...otherProps
    } = props

    return (
        <Tag
            {...otherProps}
            className={clsx(
                className,
                'dropdown-menu show',
                shadow ? `shadow-${shadow}` : null,
                variant ? `dropdown-menu-${variant}` : null,
                fillContainer ? 'full-width' : null,
                textNowrapOnItems ? 'text-nowrap-on-items' : null
            )}
            style={{
                maxHeight,
                width,
                minWidth,
                maxWidth,
                ...style,
            }}
        >
            {children}
        </Tag>
    )
}

