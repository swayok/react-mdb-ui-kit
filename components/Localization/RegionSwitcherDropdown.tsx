import React from 'react'
import Icon from 'swayok-react-mdb-ui-kit/components/Icon'
import {Dropdown} from 'swayok-react-mdb-ui-kit/components/Dropdown2/Dropdown'
import {BasicRegionConfig, FormSelectOption} from 'swayok-react-mdb-ui-kit/types/Common'
import {mdiChevronUp, mdiEarth} from '@mdi/js'
import clsx from 'clsx'
import withStable from 'swayok-react-mdb-ui-kit/helpers/withStable'
import RegionsManager from 'swayok-react-mdb-ui-kit/helpers/RegionsManager'
import LanguagesManager from 'swayok-react-mdb-ui-kit/helpers/LanguagesManager'
import {DropdownPlacement} from 'swayok-react-mdb-ui-kit/components/Dropdown2/DropdownTypes'
import { DropdownItem } from 'swayok-react-mdb-ui-kit/components/Dropdown2/DropdownItem'
import { DropdownToggle } from 'swayok-react-mdb-ui-kit/components/Dropdown2/DropdownToggle'
import { DropdownMenu } from 'swayok-react-mdb-ui-kit/components/Dropdown2/DropdownMenu'

interface Props {
    currentRegion: BasicRegionConfig
    options: FormSelectOption<BasicRegionConfig['region'], BasicRegionConfig>[]
    url: string
    // Запрет роботам преходить по ссылке. По умолчанию: true.
    noFollow?: boolean
    className?: string
    iconClassName?: string
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
        iconClassName,
        chevronClassName = 'text-gray',
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
                className={iconClassName}
            >
                <Icon
                    path={mdiEarth}
                    size={iconSize}
                />
                <Icon
                    path={mdiChevronUp}
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
