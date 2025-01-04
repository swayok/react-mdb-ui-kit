import React, {AllHTMLAttributes} from 'react'
import clsx from 'clsx'
import {AnyObject, ButtonColors, ReactComponentOrTagName} from '../types/Common'
import Ripple, {RippleProps} from './Ripple/Ripple'
import {Link, LinkProps} from 'react-router-dom'
import {PropsWithForwardedRef, withStableAndRef} from '../helpers/withStable'

export interface ButtonProps extends Omit<AllHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'label'> {
    hidden?: boolean,
    visible?: boolean,
    ripple?: ButtonColors | RippleProps,
    noRipple?: boolean,
    color?: ButtonColors,
    large?: boolean,
    small?: boolean,
    type?: 'reset' | 'submit' | 'button',
    outline?: boolean,
    rounded?: boolean,
    labelFor?: string,
    floating?: boolean,
    block?: boolean,
    active?: boolean,
    hasIcon?: boolean,
    // Внешняя ссылка (запрет использования компонента <Link> вместо <a>).
    external?: boolean,
    ref?: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement | null>,
    // Состояние для компонента <Link>.
    state?: LinkProps['state'],
}

// Стилизованная кнопка.
function Button(props: PropsWithForwardedRef<ButtonProps>) {

    if (props.hidden || props.visible === false) {
        return null
    }

    const {
        noRipple,
        ripple,
        children,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hidden,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        visible,
        type = 'button',
        role = 'button',
        large,
        small,
        href,
        target,
        external,
        color = 'primary',
        outline,
        rounded,
        floating,
        block,
        labelFor,
        active,
        disabled,
        hasIcon,
        className,
        forwardedRef,
        ...commonHtmlProps
    } = props

    let Tag: ReactComponentOrTagName
    if (href) {
        // Если указан external, то ссылку считаем внешней (не должна идти через роутер).
        Tag = external ? 'a' : Link
    } else {
        Tag = labelFor ? 'label' : 'button'
    }

    let btnColor

    if (color !== 'none') {
        if (outline) {
            if (color) {
                btnColor = `btn-outline-${color}`
            } else {
                btnColor = 'btn-outline-primary'
            }
        } else if (color) {
            btnColor = `btn-${color}`
        } else {
            btnColor = 'btn-primary'
        }
    } else {
        btnColor = ''
    }

    const classes = clsx(
        color !== 'none' ? 'btn' : null,
        color === 'link' || color === 'icon' ? 'clickable' : null, // Требуется для активации стилей "ссылки"
        btnColor,
        rounded ? 'btn-rounded' : null,
        floating ? 'btn-floating' : null,
        large && !small ? 'btn-lg' : null,
        small && !large ? 'btn-sm' : null,
        Tag !== 'button' && disabled ? 'disabled' : null,
        block ? 'btn-block' : null,
        active ? 'active' : null,
        hasIcon ? 'btn-with-icon' : null,
        hasIcon ? (outline ? 'btn-with-icon-outline' : 'btn-with-icon-solid') : null,
        className
    )

    const calculatedProps: AnyObject = {
        disabled,
        role,
    }
    if (Tag === 'button') {
        calculatedProps.type = type
    } else if (Tag === 'a') {
        calculatedProps.href = href
        calculatedProps.target = target
    } else if (Tag === 'label') {
        calculatedProps.htmlFor = labelFor
    } else {
        // <Link>
        calculatedProps.to = href
        calculatedProps.target = target
    }
    if (color === 'link') {
        return (
            <Tag
                className={classes}
                {...calculatedProps}
                {...commonHtmlProps}
                ref={forwardedRef as React.Ref<HTMLAllCollection>}
            >
                {children}
            </Tag>
        )
    } else {
        return (
            <Ripple
                rippleTag={Tag}
                {...normalizeRippleProps(ripple, color, outline)}
                noRipple={noRipple}
                className={classes}
                {...calculatedProps}
                {...commonHtmlProps}
                ref={forwardedRef as React.Ref<HTMLAllCollection>}
            >
                {children}
            </Ripple>
        )
    }
}

// Делаем props.onClick стабильным чтобы при перерисовках родительского компонента
// не перерисовывался этот компонент до тех пор, пока не изменятся нестабильные
// свойства. При этом изменение props.onClick не вызовет перерисовку, но работать
// будет без проблем.
export default withStableAndRef<
    ButtonProps,
    HTMLButtonElement | HTMLAnchorElement | null
>(['onClick'], Button, 'Button')

// Нормализация свойств анимации нажатия на кнопку.
function normalizeRippleProps(
    ripple: ButtonProps['ripple'],
    buttonColor: ButtonProps['color'],
    isOutline: ButtonProps['outline']
): RippleProps {
    let rippleProps: RippleProps = {}
    if (typeof ripple !== 'object') {
        if (ripple === undefined) {
            rippleProps.rippleColor = isOutline ? (buttonColor || 'dark') : 'light'
        } else {
            rippleProps.rippleColor = ripple
        }
    } else {
        rippleProps = ripple
    }
    return rippleProps
}
