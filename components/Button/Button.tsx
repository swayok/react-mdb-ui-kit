import clsx from 'clsx'
import {
    ComponentType,
    Ref,
    RefObject,
} from 'react'
import {
    Link,
    LinkProps,
} from 'react-router-dom'
import {
    AnyObject,
    ButtonColors,
    HtmlComponentProps,
    MergedComponentProps,
    ReactComponentOrTagName,
} from '../../types'
import {Ripple} from '../Ripple/Ripple'
import {RippleProps} from '../Ripple/RippleTypes'

export interface ButtonProps extends Omit<HtmlComponentProps<HTMLButtonElement | HTMLAnchorElement | HTMLLabelElement>, 'label'> {
    LinkComponent?: ComponentType
    hidden?: boolean
    visible?: boolean
    ripple?: ButtonColors | RippleProps
    noRipple?: boolean
    color?: ButtonColors
    large?: boolean
    small?: boolean
    type?: 'reset' | 'submit' | 'button'
    outline?: boolean
    rounded?: boolean
    labelFor?: string
    block?: boolean
    active?: boolean
    // Наличие иконки внутри кнопки и ее расположение.
    hasIcon?: 'before' | 'after' | 'somewhere' | boolean
    // Внешняя ссылка (запрет использования компонента <Link> вместо <a>).
    external?: boolean
    ref?: RefObject<HTMLButtonElement | HTMLAnchorElement | HTMLLabelElement | null>
    // Состояние для компонента <Link>.
    state?: LinkProps['state']
}

// Стилизованная кнопка.
export function Button<
    LinkComponentProps extends object = LinkProps,
>(props: MergedComponentProps<ButtonProps, Omit<LinkComponentProps, 'to'>>) {

    if (props.hidden || props.visible === false) {
        return null
    }

    const {
        children,
        hidden,
        visible,
        type = 'button',
        role = 'button',
        large,
        small,
        href,
        target,
        external,
        color = 'primary',
        ripple,
        noRipple = !ripple && (color === 'none' || color === 'link' || color === 'icon'),
        outline,
        rounded,
        block,
        labelFor,
        active,
        disabled,
        hasIcon,
        className,
        LinkComponent = Link,
        ref,
        ...commonHtmlProps
    } = props

    let Tag: ReactComponentOrTagName
    if (href) {
        // Если указан external, то ссылку считаем внешней (не должна идти через роутер).
        Tag = external ? 'a' : LinkComponent
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
        // Требуется для активации стилей "ссылки"
        color === 'link' || color === 'icon' ? 'clickable' : null,
        btnColor,
        rounded ? 'btn-rounded' : null,
        large && !small ? 'btn-lg' : null,
        small && !large ? 'btn-sm' : null,
        Tag !== 'button' && disabled ? 'disabled' : null,
        block ? 'btn-block' : null,
        active ? 'active' : null,
        hasIcon ? `btn-with-icon icon-${hasIcon === true ? 'somewhere' : hasIcon}` : null,
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
                ref={ref as Ref<HTMLAllCollection>}
            >
                {children}
            </Tag>
        )
    } else {
        return (
            <Ripple
                tag={Tag}
                {...normalizeRippleProps(ripple, color, outline)}
                noRipple={noRipple}
                className={classes}
                {...calculatedProps}
                {...commonHtmlProps}
                ref={ref as Ref<HTMLAllCollection>}
            >
                {children}
            </Ripple>
        )
    }
}

// Нормализация свойств анимации нажатия на кнопку.
function normalizeRippleProps(
    ripple: ButtonProps['ripple'],
    buttonColor: ButtonProps['color'],
    isOutline: ButtonProps['outline']
): RippleProps {
    let rippleProps: RippleProps = {}
    if (typeof ripple !== 'object') {
        if (ripple === undefined) {
            rippleProps.color = isOutline ? (buttonColor ?? 'dark') : 'light'
        } else {
            rippleProps.color = ripple
        }
    } else {
        rippleProps = ripple
    }
    return rippleProps
}
