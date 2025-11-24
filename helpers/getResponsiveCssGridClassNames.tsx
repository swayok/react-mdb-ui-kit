import clsx from 'clsx'
import {CssGridColumnsConfig} from '../types/Common'

// Собрать классы для CSS Grid по настройкам.
export function getResponsiveCssGridClassNames(
    columns: CssGridColumnsConfig,
    columnGap: number,
    rowsGap: number
): string {
    return clsx(
        'd-grid',
        'grid-columns-gap-' + columnGap,
        'grid-rows-gap-' + rowsGap,
        columns.xs ? 'grid-columns-' + columns.xs : null,
        columns.sm ? 'grid-columns-sm-' + columns.sm : null,
        columns.md ? 'grid-columns-md-' + columns.md : null,
        columns.lg ? 'grid-columns-lg-' + columns.lg : null,
        columns.xl ? 'grid-columns-xl-' + columns.xl : null,
        columns.xxl ? 'grid-columns-xxl-' + columns.xxl : null
    )
}
