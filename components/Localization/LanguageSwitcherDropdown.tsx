import React from 'react'
import Icon from 'swayok-react-mdb-ui-kit/components/Icon'
import {Dropdown} from 'swayok-react-mdb-ui-kit/components/Dropdown/Dropdown'
import {BasicLanguageConfig, FormSelectOption} from 'swayok-react-mdb-ui-kit/types/Common'
import {mdiChevronUp, mdiTranslate} from '@mdi/js'
import clsx from 'clsx'
import withStable from 'swayok-react-mdb-ui-kit/helpers/withStable'
import LanguagesManager from 'swayok-react-mdb-ui-kit/helpers/LanguagesManager'
import {DropdownPlacement} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'
import { DropdownToggle } from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownToggle'
import { DropdownMenu } from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownMenu'
import { DropdownItem } from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownItem'

interface Props {
    currentLanguage: BasicLanguageConfig
    options: FormSelectOption<BasicLanguageConfig['language'], BasicLanguageConfig>[]
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
    onSwitch?: (option: FormSelectOption<BasicLanguageConfig['language'], BasicLanguageConfig>) => void
}

// Переключатель языка.
function LanguageSwitcherDropdown(props: Props) {

    const {
        currentLanguage,
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
        >
            <DropdownToggle
                color="link"
                className={iconClassName}
            >
                <Icon
                    path={mdiTranslate}
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
                        active={option.value === currentLanguage.language}
                        href={url + `?${LanguagesManager.getUrlQueryArgName()}=${option.value}`}
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

export default withStable<Props>(['onSwitch'], LanguageSwitcherDropdown)
