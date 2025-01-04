import clsx from 'clsx'
import React from 'react'
import {useDropdownContext} from './DropdownContext'
import Button, {ButtonProps} from '../Button'
import Ripple, {RippleProps} from '../Ripple/Ripple'
import {ComponentPropsWithModifiableTag, ReactComponentOrTagName} from '../../types/Common'
import {IconButtonProps} from '../IconButton'
import withStable from '../../helpers/withStable'

export interface DropdownToggleProps extends ComponentPropsWithModifiableTag {
    split?: boolean;
    render?: (isOpened: boolean) => React.ReactNode | React.ReactNode[];
}

export interface DropdownToggleRippleProps extends RippleProps {
    split?: boolean;
    tag: typeof Ripple;
    render?: (isOpened: boolean) => React.ReactNode | React.ReactNode[];
}

export interface DropdownToggleButtonProps extends ButtonProps {
    split?: boolean;
    tag?: ReactComponentOrTagName;
    render?: (isOpened: boolean) => React.ReactNode | React.ReactNode[];
}

export interface DropdownToggleIconButtonProps extends IconButtonProps {
    split?: boolean;
    tag?: ReactComponentOrTagName;
    render?: (isOpened: boolean) => React.ReactNode | React.ReactNode[];
}

type Props = DropdownToggleProps | DropdownToggleButtonProps
    | DropdownToggleRippleProps | DropdownToggleIconButtonProps

// Компонент, открывающий/закрывающий выпадающее меню
function DropdownToggle(props: Props) {
    const {
        id,
        toggleOpenClose,
        setReferenceElement,
        isVisible,
    } = useDropdownContext()

    const {
        className,
        tag: Tag = Button,
        children,
        render,
        onClick,
        split,
        ...otherProps
    } = props

    const classes = clsx(
        'dropdown-toggle',
        split && 'dropdown-toggle-split',
        className
    )

    const handleToggleClick = (e: React.MouseEvent<HTMLElement>): void => {
        toggleOpenClose()

        onClick?.(e as never)
    }

    return (
        <Tag
            onClick={handleToggleClick}
            ref={setReferenceElement}
            className={classes}
            {...otherProps}
            aria-expanded={isVisible}
            data-id={id}
        >
            {render ? render(isVisible) : children}
        </Tag>
    )
}

export default withStable<Props>(['onClick'], DropdownToggle)
