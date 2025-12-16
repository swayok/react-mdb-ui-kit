import {
    mdiCheckboxBlankCircleOutline,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarkedCircleOutline,
    mdiCheckboxMarkedOutline,
} from '@mdi/js'
import clsx from 'clsx'
import {
    Component,
    HTMLProps,
    MouseEvent,
} from 'react'
import {DropdownHeader} from '../../Dropdown/DropdownHeader'
import {DropdownItem} from '../../Dropdown/DropdownItem'
import {
    DropdownHeaderProps,
} from '../../Dropdown/DropdownTypes'
import {Icon} from '../../Icon'
import {SelectInputBase} from './SelectInputBase'
import {
    MultiSelectInputOptionExtras,
    MultiSelectInputProps,
} from './SelectInputTypes'
import {IconProps} from '../../MDIIcon'
import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
    FormSelectOptionsList,
} from '../../../types'

// Выбор одного или нескольких из вариантов.
// Список опций автоматически генерируется на основе props.options.
// Todo: добавить поиск по опциям.
export class MultiSelectInput<
    OptionValueType = string,
    OptionExtrasType extends AnyObject = MultiSelectInputOptionExtras,
> extends Component<MultiSelectInputProps<OptionValueType, OptionExtrasType>> {

    render() {
        const {
            className,
            options,
            disableOptions,
            selectedOptionsToString,
            values,
            dropdownMenuClassName,
            stickSelectedOptionsToTop = false,
            onChange,
            required,
            nothingSelectedPlaceholder,
            renderOptionLabel,
            ...attributes
        } = this.props

        return (
            <SelectInputBase
                className={clsx(
                    'with-search form-multiselect',
                    this.getSelectedOptions().length > 0 ? null : 'empty-option-selected',
                    this.props.className
                )}
                {...attributes}
                value={this.getSelectedValuesForTextInput()}
                dropdownMenuClassName={clsx(
                    'form-multiselect-dropdown',
                    dropdownMenuClassName,
                    stickSelectedOptionsToTop ? 'stick-selected-options-to-top' : null
                )}
            >
                {this.renderOptions(this.props.options)}
            </SelectInputBase>
        )
    }

    // Рекурсивная отрисовка опций.
    private renderOptions(
        options: MultiSelectInputProps<OptionValueType, OptionExtrasType>['options'],
        radiosGroup?: FormSelectOptionGroup<OptionValueType, OptionExtrasType>
    ) {
        const ret = []
        const selectedValues: OptionValueType[] = this.getSelectedValues()
        for (let i = 0; i < options.length; i++) {
            if ('options' in options[i]) {
                // Группа опций.
                const option: FormSelectOptionGroup<OptionValueType, OptionExtrasType>
                    = options[i] as FormSelectOptionGroup<OptionValueType, OptionExtrasType>
                if (!Array.isArray(option.options) || option.options.length === 0) {
                    // Не массив или пустой массив: игнорируем.
                    continue
                }

                const groupHeaderAttributes: DropdownHeaderProps = option.groupHeaderAttributes ?? {}
                const optionsContainerAttributes: HTMLProps<HTMLDivElement> = option.optionsContainerAttributes ?? {}

                ret.push(
                    <DropdownHeader
                        key={'group-' + i}
                        {...groupHeaderAttributes}
                        className={clsx(
                            'form-dropdown-select-group-header',
                            groupHeaderAttributes?.className
                        )}
                    >
                        {
                            this.props.renderOptionLabel
                                ? this.props.renderOptionLabel(option, true)
                                : option.label
                        }
                    </DropdownHeader>
                )

                ret.push(
                    <div
                        key={'option-' + i}
                        {...optionsContainerAttributes}
                        className={clsx(
                            'form-dropdown-select-options-in-group ps-3',
                            optionsContainerAttributes?.className
                        )}
                    >
                        {this.renderOptions(
                            option.options,
                            option.extra?.radios ? option : undefined
                        )}
                    </div>
                )
            } else {
                // Обычная опция.
                const option: FormSelectOption<
                    OptionValueType,
                    OptionExtrasType
                > = options[i] as FormSelectOption<OptionValueType, OptionExtrasType>
                const {
                    label,
                    value,
                    attributes,
                } = option
                const selected = selectedValues.includes(value)
                let icon: string
                let iconColor: IconProps['color']
                if (selected) {
                    icon = radiosGroup ? mdiCheckboxMarkedCircleOutline : mdiCheckboxMarkedOutline
                    iconColor = 'blue'
                } else {
                    icon = radiosGroup ? mdiCheckboxBlankCircleOutline : mdiCheckboxBlankOutline
                    iconColor = 'gray'
                }
                const disabled: boolean = (
                    !!option.disabled
                    || !!this.props.disableOptions?.includes(value)
                )
                if (disabled) {
                    iconColor = 'muted'
                }
                ret.push(
                    <DropdownItem
                        key={'option-' + i}
                        {...attributes}
                        active={selected}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault()
                            if (!disabled) {
                                if (radiosGroup) {
                                    this.onRadioClick(option, radiosGroup)
                                } else {
                                    this.onCheckboxClick(option)
                                }
                            }
                        }}
                        className={clsx(
                            'form-multiselect-dropdown-option with-icon-flex',
                            disabled ? 'disabled' : null
                        )}
                    >
                        <Icon
                            path={icon}
                            color={iconColor}
                            className="me-1"
                        />
                        {
                            this.props.renderOptionLabel
                                ? this.props.renderOptionLabel(option, false)
                                : (
                                    <span>{label}</span>
                                )
                        }
                    </DropdownItem>
                )
            }
        }
        return ret
    }

    // Получить текстовое представление списка выбранных значений.
    private getSelectedValuesForTextInput(): string {
        const selectedOptions: FormSelectOptionsList<OptionValueType, OptionExtrasType> = this.getSelectedOptions()
        if (selectedOptions.length === 0) {
            return this.props.nothingSelectedPlaceholder ?? ''
        }

        if (this.props.selectedOptionsToString) {
            return this.props.selectedOptionsToString(selectedOptions)
        } else {
            return selectedOptions.map(option => option.label || String(option.value))
                .join(', ')
        }
    }

    // Получить список выбранных значений.
    private getSelectedValues(): OptionValueType[] {
        const options: FormSelectOptionsList<OptionValueType, OptionExtrasType> = this.getSelectedOptions()
        const values: OptionValueType[] = []
        for (const option of options) {
            values.push(option.value)
        }
        return values
    }

    // Получить список выбранных опций.
    private getSelectedOptions(): FormSelectOptionsList<OptionValueType, OptionExtrasType> {
        const ret: FormSelectOptionsList<OptionValueType, OptionExtrasType> = []
        if (Array.isArray(this.props.values) && this.props.values.length > 0) {
            // Значения заданы: ищем опции для них.
            for (const optionOrGroup of this.props.options) {
                if ('options' in optionOrGroup) {
                    // Группа опций.
                    const group: FormSelectOptionGroup<OptionValueType, OptionExtrasType>
                        = optionOrGroup as FormSelectOptionGroup<OptionValueType, OptionExtrasType>
                    // Группа опций.
                    if (!Array.isArray(group.options) || group.options.length === 0) {
                        // Не массив или пустой массив: игнорируем.
                        continue
                    }
                    for (const option of group.options) {
                        if (this.props.values.includes(option.value)) {
                            ret.push(option)
                        }
                    }
                } else {
                    if (this.props.values.includes(optionOrGroup.value)) {
                        ret.push(optionOrGroup)
                    }
                }
            }
        }
        if (ret.length > 0) {
            return ret
        }
        // Значения не заданы или не найдены.
        if (this.props.required) {
            // Требуется выбрать хотя бы одно значение: используем первую опцию в списке.
            for (const optionOrGroup of this.props.options) {
                if ('options' in optionOrGroup) {
                    const group: FormSelectOptionGroup<OptionValueType, OptionExtrasType>
                        = optionOrGroup as FormSelectOptionGroup<OptionValueType, OptionExtrasType>
                    // Группа опций.
                    if (!Array.isArray(group.options) || group.options.length === 0) {
                        // Не массив или пустой массив: игнорируем.
                        continue
                    }
                    if (group.options[0].value && group.options[0].value) {
                        return [group.options[0]]
                    }
                } else {
                    return [optionOrGroup]
                }
            }
        }
        return []
    }

    // Добавление/удаление опции из списка выбранных.
    private onCheckboxClick(option: FormSelectOption<OptionValueType, OptionExtrasType>): void {
        const selectedOptions: FormSelectOptionsList<OptionValueType, OptionExtrasType> = this.getSelectedOptions()
        const values: OptionValueType[] = []
        const newSelectedOptions: FormSelectOptionsList<OptionValueType, OptionExtrasType> = []
        let unselected: boolean = false
        for (const selectedOption of selectedOptions) {
            if (selectedOption.value === option.value) {
                unselected = true
            } else {
                values.push(selectedOption.value)
                newSelectedOptions.push(selectedOption)
            }
        }
        if (!unselected) {
            values.push(option.value)
            newSelectedOptions.push(option)
        }
        this.props.onChange(values, newSelectedOptions)
    }

    // Добавление/удаление опции из списка выбранных (режим: разрешена только одна опция из группы).
    private onRadioClick(
        option: FormSelectOption<OptionValueType, OptionExtrasType>,
        radiosGroup?: FormSelectOptionGroup<OptionValueType, OptionExtrasType>
    ): void {
        const selectedOptions: FormSelectOptionsList<OptionValueType, OptionExtrasType> = this.getSelectedOptions()
        const unselectedValues = (radiosGroup?.options ?? [])
            .filter(groupOption => option.value !== groupOption.value)
            .map(groupOption => groupOption.value)
        const newSelectedOptions: FormSelectOptionsList<OptionValueType, OptionExtrasType> = []
        const values: OptionValueType[] = []
        let unselected: boolean = false
        for (const selectedOption of selectedOptions) {
            if (unselectedValues.includes(selectedOption.value)) {
                // Опция из группы, которую не выбрана.
                continue
            }
            if (selectedOption.value === option.value) {
                unselected = true
                continue
            }
            values.push(selectedOption.value)
        }

        if (!unselected) {
            values.push(option.value)
            selectedOptions.push(option)
        }
        this.props.onChange(values, newSelectedOptions)
    }
}

/** @deprecated */
export default MultiSelectInput
