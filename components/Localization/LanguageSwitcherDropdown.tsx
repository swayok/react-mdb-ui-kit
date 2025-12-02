import {
    mdiChevronUp,
    mdiTranslate,
} from '@mdi/js'
import clsx from 'clsx'
import React from 'react'
import {DropdownPlacement} from 'swayok-react-mdb-ui-kit/components/Dropdown/DropdownTypes'
import {FormSelectOption} from 'swayok-react-mdb-ui-kit/types/Common'
import {BasicLanguageConfig} from 'swayok-react-mdb-ui-kit/types/Locale'
import {LanguagesManager} from '../../helpers/LanguagesManager'
import {Dropdown} from '../Dropdown/Dropdown'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {DropdownMenu} from '../Dropdown/DropdownMenu'
import {DropdownToggle} from '../Dropdown/DropdownToggle'
import {Icon} from '../Icon'
import {IconProps} from '../MDIIcon'

interface Props {
    currentLanguage: BasicLanguageConfig
    options: FormSelectOption<BasicLanguageConfig['language'], BasicLanguageConfig>[]
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
    onSwitch?: (option: FormSelectOption<BasicLanguageConfig['language'], BasicLanguageConfig>) => void
}

// Переключатель языка.
export function LanguageSwitcherDropdown(props: Props) {

    const {
        currentLanguage,
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
                    path={mdiTranslate}
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

/** @deprecated */
export default LanguageSwitcherDropdown
