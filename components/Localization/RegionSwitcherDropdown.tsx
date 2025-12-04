import {
    mdiChevronUp,
    mdiEarth,
} from '@mdi/js'
import clsx from 'clsx'
import {LanguagesManager} from '../../helpers/LanguagesManager'
import {RegionsManager} from '../../helpers/RegionsManager'
import {
    BasicRegionConfig,
    FormSelectOption,
} from '../../types'
import {Dropdown} from '../Dropdown/Dropdown'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {DropdownMenu} from '../Dropdown/DropdownMenu'
import {DropdownToggle} from '../Dropdown/DropdownToggle'
import {DropdownPlacement} from '../Dropdown/DropdownTypes'
import {Icon} from '../Icon'
import {IconProps} from '../MDIIcon'

interface Props {
    currentRegion: BasicRegionConfig
    options: FormSelectOption<BasicRegionConfig['region'], BasicRegionConfig>[]
    url: string
    // Запрет роботам преходить по ссылке. По умолчанию: true.
    noFollow?: boolean
    className?: string
    iconColor?: IconProps['color']
    iconClassName?: string
    chevronColor?: IconProps['color']
    chevronClassName?: string
    chevronRotate?: number
    iconSize?: number
    offset?: number
    dropdownPlacement?: DropdownPlacement
    onSwitch?: (option: FormSelectOption<BasicRegionConfig['region'], BasicRegionConfig>) => void
}

// Переключатель региона.
export function RegionSwitcherDropdown(props: Props) {

    const {
        currentRegion,
        options,
        url,
        noFollow = true,
        className,
        iconColor,
        iconClassName,
        chevronColor = 'gray',
        chevronClassName,
        chevronRotate = 0,
        iconSize = 24,
        offset = 4,
        dropdownPlacement = {
            drop: 'up',
            align: 'start',
        },
        onSwitch,
    } = props

    return (
        <Dropdown
            drop={dropdownPlacement.drop}
            align={dropdownPlacement.align}
            className={className}
            focusFirstItemOnShow="keyboard"
        >
            <DropdownToggle
                color="link"
                className={clsx(
                    'text-decoration-none',
                    iconColor ? 'link-' + iconColor : null,
                    iconClassName
                )}
            >
                <Icon
                    path={mdiEarth}
                    size={iconSize}
                />
                <Icon
                    path={mdiChevronUp}
                    color={chevronColor}
                    className={clsx(
                        'ms-n1 mt-n2',
                        chevronClassName
                    )}
                    size={iconSize - 4}
                    rotate={chevronRotate}
                />
            </DropdownToggle>
            <DropdownMenu
                className="shadow-2-strong"
                offset={offset}
            >
                {options.map(option => (
                    <DropdownItem
                        key={'locale-' + option.value}
                        active={option.value === currentRegion.region}
                        href={
                            url
                            + `?${RegionsManager.getUrlQueryArgName()}=${option.value}`
                            + `&${LanguagesManager.getUrlQueryArgName()}=${option.extra?.defaultLanguage ?? option.value}`
                        }
                        external
                        rel={noFollow ? 'nofollow' : undefined}
                        onClick={event => {
                            if (onSwitch) {
                                event.preventDefault()
                                onSwitch(option)
                            }
                        }}
                    >
                        {option.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
}

/** @deprecated */
export default RegionSwitcherDropdown
