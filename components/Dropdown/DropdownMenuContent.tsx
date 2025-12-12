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
        isOpen,
        className,
        shadow,
        tag: Tag = 'div',
        variant,
        maxHeight,
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
                'dropdown-menu',
                shadow ? `shadow-${shadow}` : null,
                isOpen ? 'show' : null,
                variant ? `dropdown-menu-${variant}` : null,
                fillContainer ? 'full-width' : null,
                textNowrapOnItems ? 'text-nowrap-on-items' : null
            )}
            style={{
                ...style,
                ...(maxHeight ? {maxHeight} : {}),
            }}
        >
            {children}
        </Tag>
    )
}

