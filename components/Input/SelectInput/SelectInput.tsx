import clsx from 'clsx'
import {
    ChangeEvent,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {findSelectedOption} from '../../../helpers/findSelectedOption'
import {isSameOptionValue} from '../../../helpers/isSameOptionValue'
import {stripTags} from '../../../helpers/stripTags'
import {useEventCallback} from '../../../helpers/useEventCallback'
import {useMergedRefs} from '../../../helpers/useMergedRefs'
import {UserBehaviorService} from '../../../services/UserBehaviorService'
import {AnyObject} from '../../../types'
import {DropdownContextProps} from '../../Dropdown/DropdownTypes'
import {flattenOptions} from '../helpers/flattenOptions'
import {Input} from '../Input'
import {SelectInputBase} from './SelectInputBase'
import {SelectInputOptions} from './SelectInputOptions'
import {
    FlattenedOptionOrGroup,
    SelectInputBasicApi,
    SelectInputProps,
} from './SelectInputTypes'
import {VirtualizedSelectInputOptions} from './VirtualizedSelectInputOptions'

interface KeywordsState {
    value: string
    regexp: null | RegExp
}

/**
 * Поле выбора одного из вариантов.
 * Список опций автоматически генерируется на основе props.options.
 * Есть опциональная возможность поиска по опциям (props.search).
 *
 * Конвертация различных типов объектов в опции:
 * @see OptionsHelper
 */
export function SelectInput<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
>(props: SelectInputProps<OptionValueType, OptionExtrasType>) {
    const {
        apiRef: propsApiRef,
        inputRef: propsInputRef,
        className,
        options: propsOptions = [],
        valueToString,
        value,
        search,
        searchPlaceholder,
        onChange: propsOnChange,
        enableVirtualization = false,
        maxHeight = 500,
        labelsContainHtml,
        hideEmptyOptionInDropdown,
        withEmptyOption,
        withPermanentOption,
        disableOptions = [],
        renderOptionLabel,
        trackBehaviorAs,
        selectFirstIfNotFound = true,
        closeDropdownOnSelect = true,
        // Dropdown
        onOpenChange: propsOnOpenChange,
        ...basicSelectInputProps
    } = props

    const inputRef = useRef<HTMLInputElement>(null)
    const apiRef = useRef<SelectInputBasicApi>(null)
    const keywordsInputRef = useRef<HTMLInputElement>(null)

    const mergedApiRef = useMergedRefs(
        propsApiRef,
        apiRef
    )
    const mergedInputRef = useMergedRefs(
        propsInputRef,
        inputRef
    )

    const [
        keywords,
        setKeywords,
    ] = useState<KeywordsState>({
        value: '',
        regexp: null,
    })

    const keywordsRegexp: RegExp | null = useDeferredValue<KeywordsState['regexp']>(
        keywords.regexp
    )

    // Конвертация дерева опций в плоский массив.
    const options: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[] = useMemo(
        () => {
            const initial: FlattenedOptionOrGroup<OptionValueType, OptionExtrasType>[] = []
            if (withEmptyOption && !hideEmptyOptionInDropdown) {
                initial.push({
                    isGroup: false,
                    data: withEmptyOption,
                    index: -1,
                    groupIndex: null,
                })
            }
            const ret = flattenOptions<OptionValueType, OptionExtrasType>(
                propsOptions,
                initial
            )
            if (withPermanentOption) {
                ret.push({
                    isGroup: false,
                    data: withPermanentOption,
                    index: -2,
                    groupIndex: null,
                })
            }
            return ret
        },
        [
            propsOptions,
            withEmptyOption?.label,
            withEmptyOption?.value,
            withPermanentOption?.label,
            withPermanentOption?.value,
        ]
    )

    // Поиск выбранной опции.
    const selectedOption = useMemo(
        () => findSelectedOption<OptionValueType, OptionExtrasType>(
            propsOptions,
            value,
            withEmptyOption,
            withPermanentOption,
            selectFirstIfNotFound
        ),
        [
            propsOptions,
            value,
            withEmptyOption?.value,
            withPermanentOption?.value,
            selectFirstIfNotFound,
        ]
    )

    // Подпись выбранной опции для отображения в поле ввода.
    const selectedValueForTextInput = useMemo((): string => {
        if (selectedOption === undefined) {
            return ''
        }

        if (valueToString) {
            return valueToString(selectedOption.option)
        } else if (selectedOption.option.label) {
            return labelsContainHtml
                ? stripTags(selectedOption.option.label)
                : selectedOption.option.label
        } else {
            return String(selectedOption.option.value)
        }
    }, [selectedOption, valueToString, labelsContainHtml])

    const onDropdownToggle = useEventCallback<DropdownContextProps['setIsOpen']>((
        open: boolean,
        event,
        reason
    ): void => {
        if (open && trackBehaviorAs && inputRef.current) {
            UserBehaviorService.onFocus(
                inputRef.current,
                trackBehaviorAs,
                (value as string) || null
            )
        }
        if (open) {
            setTimeout(() => {
                keywordsInputRef.current?.focus()
            }, 100)
        } else {
            setKeywords({
                value: '',
                regexp: null,
            })
        }
        propsOnOpenChange?.(open, event, reason)
    })

    const onSearchInputChange = useEventCallback((
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setKeywords({
            value: event.target.value,
            regexp: event.target.value.trim().length > 0
                ? new RegExp(
                    event.target.value.trim()
                        .replace(/[{}\][*?:'"()!@#$^%&+,;`<>/\\]/, '')
                        .replace(/[её]/igu, '[её]')
                        .replace(/\./, '\\.')
                        .replace(/\s+/, '.*'),
                    'igu'
                )
                : null,
        })
    })

    const onOptionSelected = useEventCallback((
        value: OptionValueType,
        label: string,
        index: number,
        groupIndex: number | null,
        extra?: OptionExtrasType
    ) => {
        propsOnChange(value, label, index, groupIndex, extra)
        if (closeDropdownOnSelect) {
            apiRef.current?.setIsOpen(false)
        }
    })

    const onOptionSelectByIndex = useEventCallback((
        index: number
    ) => {
        // Todo: test this on groups.
        if (options[index] && !options[index].isGroup) {
            onOptionSelected(
                options[index].data.value,
                options[index].data.label,
                options[index].index,
                options[index].groupIndex,
                options[index].data.extra
            )
        }
    })

    // Обработка ситуации, когда значение props.value отсутствует в списке options.
    useEffect(
        () => {
            if (
                !props.disabled
                && !props.readOnly
                && selectedOption
                && !isSameOptionValue(selectedOption.expectedValue, selectedOption.option.value)
            ) {
                // Ситуация, когда selectedOption.option.value отличается от props.value.
                // Это может произойти, когда props.value пустой, но при этом в списке
                // опций нет опции с пустым значением (опции по-умолчанию) и не указано
                // значение withEmptyOption.
                // Так же это может произойти, если опция, соответствующая значению
                // props.value, была удалена из списка опций.
                // В этих случаях нужно вызвать onChange со значением selectedOption.option.value.
                propsOnChange(
                    selectedOption.option.value,
                    selectedOption.option.label,
                    selectedOption.index,
                    selectedOption.groupIndex,
                    selectedOption.option.extra
                )
            }
        },
        // Только при изменении списка опций, т.к. иначе будут незапланированные вызовы onChange.
        [options]
    )

    const virtualizationEnabled: boolean = enableVirtualization === 'auto'
        ? options.length > 50
        : enableVirtualization

    return (
        <SelectInputBase
            inputRef={mergedInputRef}
            apiRef={mergedApiRef}
            className={clsx(
                search ? 'with-search' : null,
                value === null || value === '' ? 'empty-option-selected' : null,
                className
            )}
            {...basicSelectInputProps}
            value={selectedValueForTextInput}
            onOpenChange={onDropdownToggle}
            maxHeight={maxHeight}
            onOptionSelect={onOptionSelectByIndex}
        >
            {search && (
                <div
                    className={clsx(
                        'pb-2 px-2 border-bottom',
                        searchPlaceholder ? 'pt-3' : 'pt-2'
                    )}
                >
                    <Input
                        inputRef={keywordsInputRef}
                        label={searchPlaceholder}
                        active
                        value={keywords.value}
                        wrapperClassName="m-0"
                        onChange={onSearchInputChange}
                    />
                </div>
            )}
            {virtualizationEnabled ? (
                <VirtualizedSelectInputOptions<OptionValueType, OptionExtrasType>
                    options={options}
                    selectedOption={selectedOption?.option}
                    trackBehaviorAs={trackBehaviorAs}
                    labelsContainHtml={labelsContainHtml}
                    hideEmptyOptionInDropdown={hideEmptyOptionInDropdown}
                    renderOptionLabel={renderOptionLabel}
                    keywordsRegexp={keywordsRegexp}
                    search={search}
                    height={maxHeight}
                    disableOptions={disableOptions}
                    onChange={onOptionSelected}
                />
            ) : (
                <SelectInputOptions<OptionValueType, OptionExtrasType>
                    options={options}
                    selectedOption={selectedOption?.option}
                    trackBehaviorAs={trackBehaviorAs}
                    labelsContainHtml={labelsContainHtml}
                    hideEmptyOptionInDropdown={hideEmptyOptionInDropdown}
                    renderOptionLabel={renderOptionLabel}
                    keywordsRegexp={keywordsRegexp}
                    search={search}
                    disableOptions={disableOptions}
                    onChange={onOptionSelected}
                />
            )}
        </SelectInputBase>
    )
}

/** @deprecated */
export default SelectInput
