import React, {useCallback} from 'react'
import {TabSheetTabButtonProps} from '../../types/TabSheet'
import clsx from 'clsx'
import {useTabSheetContext} from './TabSheetContext'
import withStable from '../../helpers/withStable'
import Ripple, {RippleProps} from '../Ripple/Ripple'

// Кнопка переключения на вкладку.
function TabSheetTabButton<TabName extends string = string>(
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

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setCurrentTab(name)
        onClick?.(event)
    }, [onClick, name])

    return (
        <li
            {...liProps}
            className={clsx('nav-item', className)}
        >
            <Ripple
                rippleTag="button"
                {...normalizeRippleProps(ripple)}
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

export default withStable<TabSheetTabButtonProps>(
    ['onClick'],
    TabSheetTabButton
) as typeof TabSheetTabButton

// Нормализация свойств анимации нажатия на кнопку.
function normalizeRippleProps(
    ripple: TabSheetTabButtonProps['ripple']
): RippleProps {
    let rippleProps: RippleProps = {}
    if (typeof ripple !== 'object') {
        rippleProps.rippleColor = ripple === undefined ? 'primary' : ripple
    } else {
        rippleProps = ripple
    }
    return rippleProps
}
