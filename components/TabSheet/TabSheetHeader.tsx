import React from 'react'
import {TabSheetHeaderProps} from '../../types/TabSheet'
import CardHeader from '../Card/CardHeader'
import clsx from 'clsx'

// Контейнер кнопок переключения вкладок (<TabSheetTabButton>).
function TabSheetHeader(props: TabSheetHeaderProps) {

    const {
        tag,
        children,
        className,
        ...otherProps
    } = props

    const Tag = tag || CardHeader

    return (
        <Tag
            {...otherProps}
            className={clsx('tabsheet-header', className || 'p-0')}
        >
            <ul className="nav nav-tabs" role="tablist">
                {children}
            </ul>
        </Tag>
    )
}

export default React.memo(TabSheetHeader)
