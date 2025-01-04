import React, {HTMLProps} from 'react'
import clsx from 'clsx'
import Icon from '../Icon'
import {
    mdiCheckboxBlankCircleOutline,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarkedCircleOutline,
    mdiCheckboxMarkedOutline,
} from '@mdi/js'
import {
    FormSelectOption,
    FormSelectOptionGroup,
    FormSelectOptionsAndGroupsList,
    FormSelectOptionsList,
} from '../../types/Common'
import SelectInputBasic, {SelectInputBasicProps} from './SelectInput/SelectInputBasic'
import DropdownItem, {DropdownItemProps} from '../Dropdown/DropdownItem'
import DropdownHeader from '../Dropdown/DropdownHeader'
import withStable from '../../helpers/withStable'
import DropdownButton from '../Dropdown/DropdownButton'

export interface MultiSelectInputProps<OptionValueType = string> extends Omit<SelectInputBasicProps, 'value' | 'onChange' | 'children'> {
    options: FormSelectOptionsAndGroupsList<OptionValueType>;
    onChange: (values: OptionValueType[], options: FormSelectOptionsList<OptionValueType>) => void;
    values?: OptionValueType[];
    // Требуется ли выбрать хотя бы одно значение?
    required?: boolean;
    // Конвертация выбранных опций для отображения в поле ввода.
    // По умолчанию отображается список из FormSelectOption['label'].
    selectedOptionsToString?: (selectedOptions: FormSelectOptionsList<OptionValueType>) => string;
    // Текст для отображения в случае, если ни одной опции не выбрано.
    nothingSelectedPlaceholder?: string;
    // Отключить возможность выбрать указанные опции.
    disableOptions?: OptionValueType[];
}

// Выбор одного или нескольких из вариантов.
// Список опций автоматически генерируется на основе props.options.
// Todo: добавить поиск по опциям.
class MultiSelectInput<OptionValueType = string> extends React.Component<MultiSelectInputProps<OptionValueType>> {

    render() {
        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            className,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            options,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            disableOptions,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            selectedOptionsToString,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            values,
            dropdownFluidWidth = true,
            dropdownMenuClassName,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            required,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            nothingSelectedPlaceholder,
            ...attributes
        } = this.props

        return (
            <SelectInputBasic
                className={clsx(
                    'with-search form-multiselect',
                    this.getSelectedOptions().length > 0 ? null : 'empty-option-selected',
                    this.props.className
                )}
                {...attributes}
                dropdownFluidWidth={dropdownFluidWidth}
                value={this.getSelectedValuesForTextInput()}
                dropdownMenuClassName={clsx(
                    'form-multiselect-dropdown',
                    dropdownMenuClassName
                )}
            >
                {this.renderOptions(this.props.options)}
            </SelectInputBasic>
        )
    }

    // Рекурсивная отрисовка опций.
    private renderOptions(
        options: MultiSelectInputProps<OptionValueType>['options'],
        radiosGroup?: FormSelectOptionGroup<OptionValueType>
    ) {
        const ret = []
        const selectedValues: OptionValueType[] = this.getSelectedValues()
        for (let i = 0; i < options.length; i++) {
            if ('options' in options[i]) {
                // Группа опций.
                const option: FormSelectOptionGroup<OptionValueType>
                    = options[i] as FormSelectOptionGroup<OptionValueType>
                if (!Array.isArray(option.options) || option.options.length === 0) {
                    // Не массив или пустой массив: игнорируем.
                    continue
                }

                const groupHeaderAttributes: DropdownItemProps = option.groupHeaderAttributes || {}
                const optionsContainerAttributes: HTMLProps<HTMLDivElement> = option.optionsContainerAttributes || {}

                ret.push(
                    <DropdownItem
                        key={'group-' + i}
                        {...groupHeaderAttributes}
                        className={clsx('form-dropdown-select-group-header', groupHeaderAttributes?.className)}
                        highlightable={false}
                        active={false}
                        closeDropdownOnClick={false}
                    >
                        <DropdownHeader>
                            {option.label}
                        </DropdownHeader>
                    </DropdownItem>
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
                const option: FormSelectOption<OptionValueType> = options[i] as FormSelectOption<OptionValueType>
                const {
                    label,
                    value,
                    attributes,
                } = option
                const selected = selectedValues.includes(value)
                let icon: string
                let iconColor: string
                if (selected) {
                    icon = radiosGroup ? mdiCheckboxMarkedCircleOutline : mdiCheckboxMarkedOutline
                    iconColor = 'text-blue'
                } else {
                    icon = radiosGroup ? mdiCheckboxBlankCircleOutline : mdiCheckboxBlankOutline
                    iconColor = 'text-gray'
                }
                const disabled: boolean = (
                    option.disabled
                    || !!(this.props.disableOptions && this.props.disableOptions.includes(value))
                )
                if (disabled) {
                    iconColor = 'text-muted'
                }
                ret.push(
                    <DropdownItem
                        key={'option-' + i}
                        {...attributes}
                        highlightable={false}
                        active={false}
                        closeDropdownOnClick={false}
                    >
                        <DropdownButton
                            closeDropdownOnClick={false}
                            onClick={(e: React.MouseEvent) => {
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
                                disabled ? 'disabled ' : null
                            )}
                        >
                            <Icon
                                path={icon}
                                className={clsx('me-1', iconColor)}
                            />
                            <span>{label}</span>
                        </DropdownButton>
                    </DropdownItem>
                )
            }
        }
        return ret
    }

    // Получить текстовое представление списка выбранных значений.
    private getSelectedValuesForTextInput(): string {
        const selectedOptions: FormSelectOptionsList<OptionValueType> = this.getSelectedOptions()
        if (selectedOptions.length === 0) {
            return this.props.nothingSelectedPlaceholder || ''
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
        const options: FormSelectOptionsList<OptionValueType> = this.getSelectedOptions()
        const values: OptionValueType[] = []
        for (let i = 0; i < options.length; i++) {
            values.push(options[i].value)
        }
        return values
    }

    // Получить список выбранных опций.
    private getSelectedOptions(): FormSelectOptionsList<OptionValueType> {
        const ret: FormSelectOptionsList<OptionValueType> = []
        if (Array.isArray(this.props.values) && this.props.values.length > 0) {
            // Значения заданы: ищем опции для них.
            for (let i = 0; i < this.props.options.length; i++) {
                if ('options' in this.props.options[i]) {
                    const option: FormSelectOptionGroup<OptionValueType>
                        = this.props.options[i] as FormSelectOptionGroup<OptionValueType>
                    // Группа опций.
                    if (!Array.isArray(option.options) || option.options.length === 0) {
                        // Не массив или пустой массив: игнорируем.
                        continue
                    }
                    for (let j = 0; j < option.options.length; j++) {
                        if (this.props.values.includes(option.options[j].value)) {
                            ret.push(option.options[j])
                        }
                    }
                } else {
                    const option: FormSelectOption<OptionValueType>
                        = this.props.options[i] as FormSelectOption<OptionValueType>
                    if (this.props.values.includes(option.value)) {
                        ret.push(option)
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
            for (let i = 0; i < this.props.options.length; i++) {
                if ('options' in this.props.options[i]) {
                    const option: FormSelectOptionGroup<OptionValueType>
                        = this.props.options[i] as FormSelectOptionGroup<OptionValueType>
                    // Группа опций.
                    if (!Array.isArray(option.options) || option.options.length === 0) {
                        // Не массив или пустой массив: игнорируем.
                        continue
                    }
                    if (option.options[0].value && option.options[0].value) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return [option.options[0]]
                    }
                } else {
                    return [this.props.options[i] as FormSelectOption<OptionValueType>]
                }
            }
        }
        return []
    }

    // Добавление/удаление опции из списка выбранных.
    private onCheckboxClick(option: FormSelectOption<OptionValueType>): void {
        const selectedOptions: FormSelectOptionsList<OptionValueType> = this.getSelectedOptions()
        const values: OptionValueType[] = []
        const newSelectedOptions: FormSelectOptionsList<OptionValueType> = []
        let unselected: boolean = false
        for (let j = 0; j < selectedOptions.length; j++) {
            if (option.value === selectedOptions[j].value) {
                unselected = true
            } else {
                values.push(selectedOptions[j].value)
                newSelectedOptions.push(selectedOptions[j])
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
        option: FormSelectOption<OptionValueType>,
        radiosGroup?: FormSelectOptionGroup<OptionValueType>
    ): void {
        const selectedOptions: FormSelectOptionsList<OptionValueType> = this.getSelectedOptions()
        const unselectedValues = (radiosGroup?.options || [])
            .filter(groupOption => option.value !== groupOption.value)
            .map(groupOption => groupOption.value)
        const newSelectedOptions: FormSelectOptionsList<OptionValueType> = []
        const values: OptionValueType[] = []
        let unselected: boolean = false
        for (let j = 0; j < selectedOptions.length; j++) {
            if (unselectedValues.includes(selectedOptions[j].value)) {
                // Опция из группы, которую не выбрана.
                continue
            }
            if (option.value === selectedOptions[j].value) {
                unselected = true
                continue
            }
            values.push(selectedOptions[j].value)
        }

        if (!unselected) {
            values.push(option.value)
            selectedOptions.push(option)
        }
        this.props.onChange(values, newSelectedOptions)
    }
}

export default withStable<MultiSelectInputProps>(
    ['onChange'],
    props => <MultiSelectInput {...props}/>
) as unknown as typeof MultiSelectInput
