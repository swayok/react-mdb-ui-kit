import React from 'react'
import {TabSheetBodyProps} from 'swayok-react-mdb-ui-kit/components/TabSheet/TabSheetTypes'
import clsx from 'clsx'

// Контейнер с блоками содержимого вкладок (<TabSheetTabContent>).
function TabSheetBody(props: TabSheetBodyProps) {

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

export default React.memo(TabSheetBody)
