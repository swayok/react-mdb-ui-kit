import clsx from 'clsx'
import React from 'react'
import {useDropdownContext} from './DropdownContext'
import {ComponentPropsWithModifiableTag} from '../../types/Common'
import withStable from '../../helpers/withStable'

export interface DropdownButtonProps extends ComponentPropsWithModifiableTag {
    closeDropdownOnClick?: boolean,
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
}

// Кнопка внутри элемента выпадающего меню.
// Для ссылок нужно использовать DropdownLink.
function DropdownButton(props: DropdownButtonProps) {

    const {
        handleClose,
        isAllItemsDisabled: dropdownDisabled,
    } = useDropdownContext()

    const {
        onClick,
        className = 'text-default',
        tag: Tag = 'div',
        children,
        closeDropdownOnClick = true,
        ...otherProps
    } = props

    const classes = clsx('dropdown-item clickable', className)

    // Обработка нажатия на кнопку
    const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
        if (props.disabled || dropdownDisabled) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
        if (closeDropdownOnClick) {
            handleClose()
        } else {
            e.currentTarget.blur()
        }

        onClick?.(e)
        e.stopPropagation()
    }

    return (
        <Tag
            className={classes}
            {...otherProps}
            onClick={handleClickItem}
        >
            {children}
        </Tag>
    )
}

export default withStable<DropdownButtonProps>(['onClick'], DropdownButton)
