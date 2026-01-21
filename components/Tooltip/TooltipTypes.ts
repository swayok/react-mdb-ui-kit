import {Placement} from '@floating-ui/utils'
import type {
    CSSProperties,
    ReactNode,
} from 'react'
import type {
    HtmlComponentProps,
    MergedComponentProps,
    MorphingComponentProps,
} from '../../types'

// Собственные свойства компонента Tooltip.
export interface TooltipProps extends MorphingComponentProps {
    children?: ReactNode | ReactNode[]
    tooltipPlacement?: Placement
    title?: string | ReactNode
    tooltipDisableClickHandler?: boolean
    tooltipDisableHover?: boolean
    tooltipClassName?: string
    tooltipTextClassName?: string
    tooltipStyle?: CSSProperties
    tooltipMaxWidth?: number
    tooltipOffset?: number
    /**
     * Роль подсказки.
     * Для иконки/элемента без собственной подписи: 'label'.
     * Для элементов с подписями - 'tooltip'.
     * По умолчанию: 'tooltip'.
     */
    tooltipRole?: 'tooltip' | 'label'
    // Отключить анимацию скрытия подсказки.
    noHideAnimation?: boolean
}

// Свойства компонента Tooltip и свойства компонента, передаваемого через tag по умолчанию (div).
// Для использования в других компонентах со свойством типа tooltipProps.
export type DefaultTooltipProps = MergedComponentProps<TooltipProps, HtmlComponentProps>
