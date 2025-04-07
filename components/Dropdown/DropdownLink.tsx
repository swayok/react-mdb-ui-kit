import clsx from 'clsx'
import React from 'react'
import {useDropdownContext} from './DropdownContext'
import {AnyObject, ComponentPropsWithModifiableTag, ReactComponentOrTagName} from '../../types/Common'
import {Link} from 'react-router-dom'
import withStable from '../../helpers/withStable'

export interface DropdownLinkProps extends ComponentPropsWithModifiableTag {
    closeDropdownOnClick?: boolean,
    external?: boolean
}

// Ссылка внутри элемента выпадающего меню
function DropdownLink(props: DropdownLinkProps) {

    const {
        handleClose,
        isAllItemsDisabled: dropdownDisabled,
    } = useDropdownContext()

    const {
        onClick,
        className,
        tag = 'a',
        href,
        target,
        external,
        children,
        closeDropdownOnClick = true,
        ...otherProps
    } = props

    let Tag: ReactComponentOrTagName = tag
    const urlProps: AnyObject = {}
    if (target) {
        urlProps.target = target
    }
    if (tag === 'a' && href && !external) {
        // Конвертируем в <Link>, чтобы работало с навигацией
        Tag = Link
        urlProps.to = href
    } else if (tag === 'a') {
        // Если указан target или external, то ссылку считаем внешней (не должна идти через роутер)
        urlProps.href = href
    }

    const classes: string = clsx('dropdown-item', className)

    // Обработка нажатия на кнопку
    const handleClickItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
            {...urlProps}
            onClick={handleClickItem}
        >
            {children}
        </Tag>
    )
}

export default withStable<DropdownLinkProps>(['onClick'], DropdownLink)
