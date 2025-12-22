import {
    mdiChevronUp,
    mdiTranslate,
} from '@mdi/js'
import clsx from 'clsx'
import {LanguagesManager} from '../../helpers/i18n/LanguagesManager'
import {
    BasicLanguageConfig,
    FormSelectOption,
} from '../../types'
import {Dropdown} from '../Dropdown/Dropdown'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {DropdownMenu} from '../Dropdown/DropdownMenu'
import {DropdownToggle} from '../Dropdown/DropdownToggle'
import {DropdownPlacement} from '../Dropdown/DropdownTypes'
import {Icon} from '../Icon/Icon'
import {MdiIconProps} from '../Icon/MDIIcon'

interface Props {
    currentLanguage: BasicLanguageConfig
    options: FormSelectOption<BasicLanguageConfig['language'], BasicLanguageConfig>[]
    url: string
    // Запрет роботам преходить по ссылке. По умолчанию: true.
    noFollow?: boolean
    className?: string
    iconColor?: MdiIconProps['color']
    iconClassName?: string
    chevronColor?: MdiIconProps['color']
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
        <div className={className}>
            <Dropdown
                focusFirstItemOnOpen={false}
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
                    offset={offset}
                    drop={dropdownPlacement.drop}
                    align={dropdownPlacement.align}
                    shadow="2-strong"
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
        </div>
    )
}
