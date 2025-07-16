import React from 'react'
import Icon from 'swayok-react-mdb-ui-kit/components/Icon'
import {Dropdown} from 'swayok-react-mdb-ui-kit/components/Dropdown/Dropdown'
import {IconProps} from 'swayok-react-mdb-ui-kit/components/MDIIcon'
import {BasicRegionConfig, FormSelectOption} from 'swayok-react-mdb-ui-kit/types/Common'
import {mdiChevronUp, mdiEarth} from '@mdi/js'
import clsx from 'clsx'
import withStable from 'swayok-react-mdb-ui-kit/helpers/withStable'
import RegionsManager from 'swayok-react-mdb-ui-kit/helpers/RegionsManager'
import LanguagesManager from 'swayok-react-mdb-ui-kit/helpers/LanguagesManager'
import {DropdownPlacement} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'
import { DropdownItem } from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownItem'
import { DropdownToggle } from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownToggle'
import { DropdownMenu } from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownMenu'

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
function RegionSwitcherDropdown(props: Props) {

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

export default withStable<Props>(['onSwitch'], RegionSwitcherDropdown)
