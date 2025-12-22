import {mdiChevronRight} from '@mdi/js'
import {
    HtmlComponentProps,
    MergedComponentProps,
} from '../../types'
import {Icon} from '../Icon/Icon'
import {DropdownToggle} from './DropdownToggle'
import {SubmenuDropdownToggleProps} from './DropdownTypes'

// Кнопка открытия вложенного выпадающего меню.
export function SubmenuDropdownToggle(
    props: MergedComponentProps<
        SubmenuDropdownToggleProps<HtmlComponentProps<HTMLDivElement>>,
        Omit<HtmlComponentProps<HTMLDivElement>, 'onFocus'>
    >
) {
    const {
        children,
        chevron = true,
        chevronSize = 20,
        className = chevron
            ? 'with-icon-flex justify-content-between'
            : undefined,
        ...otherProps
    } = props

    return (
        <DropdownToggle<HtmlComponentProps<HTMLDivElement>, HTMLDivElement>
            tag="div"
            {...otherProps}
            className={className}
        >
            {children}
            {chevron && (
                <Icon
                    path={mdiChevronRight}
                    className="chevron"
                    size={chevronSize}
                />
            )}
        </DropdownToggle>
    )
}
