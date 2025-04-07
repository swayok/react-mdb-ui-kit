import React, {useEffect} from 'react'
import {useDropdownContext} from './DropdownContext'
import clsx from 'clsx'
import {AnyObject, ComponentPropsWithModifiableTag} from '../../types/Common'
import withStable from '../../helpers/withStable'

export interface DropdownItemProps extends ComponentPropsWithModifiableTag {
    highlightable?: boolean,
    active?: boolean,
    closeDropdownOnClick?: boolean
}

// Элемент выпадающего меню
function DropdownItem(props: DropdownItemProps) {
    const {
        onClick,
        tag: Tag = 'li',
        children,
        className,
        active,
        highlightable = true,
        closeDropdownOnClick = true,
        ...otherProps
    } = props

    const {
        activeIndex,
        handleClose,
        increment,
        decrement,
        itemsCountRef,
        setActiveIndex,
        isAllItemsDisabled: dropdownDisabled,
    } = useDropdownContext()

    const indexRef = React.useRef<number | null>(null)

    // Регистрация подсвечиваемого пункта меню и получение индекса.
    useEffect(() => {
        if (highlightable) {
            indexRef.current = increment()
            return () => {
                decrement()
                indexRef.current = null
            }
        } else {
            return () => {
            }
        }
    }, [highlightable, itemsCountRef.current])

    // Активация подсветки пункта меню.
    useEffect(() => {
        if (active && indexRef.current) {
            setActiveIndex(indexRef.current)
        }
    }, [highlightable, active, indexRef.current])

    // Обработка нажатия на пункт меню.
    const handleClickItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (props.disabled || dropdownDisabled) {
            e.preventDefault()
            return
        }
        if (closeDropdownOnClick) {
            handleClose()
        } else {
            (e.target as HTMLElement).blur()
        }
        onClick?.(e)
    }

    const activityProps: AnyObject = {}
    let activityClassName: string | null = ''
    if (highlightable) {
        activityProps['data-index'] = indexRef.current
        const isActive = activeIndex === indexRef.current
        activityProps['data-active'] = isActive
        activityClassName = isActive ? 'active' : null
    } else if (active) {
        activityProps['data-active'] = active
        activityClassName = active ? 'active' : null
    }

    return (
        <Tag
            tabIndex="0"
            {...otherProps}
            {...activityProps}
            className={clsx(className, activityClassName)}
            onClick={handleClickItem}
        >
            {children}
        </Tag>
    )
}

export default withStable<DropdownItemProps>(['onClick'], DropdownItem)
