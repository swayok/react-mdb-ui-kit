import clsx from 'clsx'
import {TabSheetBodyProps} from './TabSheetTypes'

// Контейнер с блоками содержимого вкладок (<TabSheetTabContent>).
export function TabSheetBody(props: TabSheetBodyProps) {

    const {
        tag,
        className,
        children,
        ...otherProps
    } = props

    const Tag = tag || 'div'

    return (
        <Tag
            {...otherProps}
            className={clsx('tab-content tabsheet-body', className)}
        >
            {children}
        </Tag>
    )
}

/** @deprecated */
export default TabSheetBody
