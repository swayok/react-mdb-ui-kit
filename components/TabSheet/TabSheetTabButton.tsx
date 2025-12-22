import clsx from 'clsx'
import {
    MouseEvent,
    useCallback,
    useMemo,
} from 'react'
import {Ripple} from '../Ripple/Ripple'
import {RippleProps} from '../Ripple/RippleTypes'
import {useTabSheetContext} from './TabSheetContext'
import {TabSheetTabButtonProps} from './TabSheetTypes'

// Кнопка переключения на вкладку.
export function TabSheetTabButton<TabName extends string = string>(
    props: TabSheetTabButtonProps<TabName>
) {
    const {
        children,
        name,
        className,
        buttonProps,
        onClick,
        ripple,
        noRipple,
        ...liProps
    } = props

    const {
        className: buttonClassName,
        ...otherButtonProps
    } = (buttonProps || {})

    const {
        currentTab,
        setCurrentTab,
    } = useTabSheetContext<TabName>()

    const rippleProps = useMemo(() => {
        let rippleProps: RippleProps = {}
        if (typeof ripple !== 'object') {
            rippleProps.color = ripple === undefined ? 'primary' : ripple
        } else {
            rippleProps = ripple
        }
        return rippleProps
    }, [ripple])

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()
            setCurrentTab(name)
            onClick?.(event)
        },
        [onClick, name]
    )

    return (
        <li
            {...liProps}
            className={clsx('nav-item', className)}
        >
            <Ripple
                tag="button"
                {...rippleProps}
                noRipple={noRipple}
                {...otherButtonProps}
                type="button"
                className={clsx(
                    'nav-link',
                    buttonClassName,
                    currentTab === name ? 'active' : null
                )}
                onClick={handleClick}
                role="tab"
                aria-selected={currentTab === name ? 'true' : 'false'}
            >
                {children}
            </Ripple>
        </li>
    )
}
