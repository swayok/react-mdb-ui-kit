import React, {useEffect, useState} from 'react'
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
        setActiveIndex,
        itemsCount,
        isAllItemsDisabled: dropdownDisabled,
    } = useDropdownContext()

    const [
        index,
        setIndex,
    ] = useState<undefined | number>(undefined)

    useEffect(() => {
        if (highlightable) {
            increment()
                .then((index: number) => {
                    setIndex(index)
                    if (active) {
                        setActiveIndex(index)
                    }
                })
                .catch(() => {
                })
            return decrement
        } else {
            return () => {
            }
        }
    }, [highlightable, active, itemsCount])

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
        activityProps['data-index'] = index
        const isActive = activeIndex === index
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
