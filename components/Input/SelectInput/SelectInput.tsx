import clsx from 'clsx'
import React, {
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
import {UserBehaviorService} from '../../../services/UserBehaviorService'
import {AnyObject} from '../../../types'
import {DropdownContextProps} from '../../Dropdown/DropdownTypes'
import {Input} from '../Input'
import {SelectInputBasic} from './SelectInputBasic'
import {SelectInputOptions} from './SelectInputOptions'
import {SelectInputProps} from './SelectInputTypes'
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
        className,
        options = [],
        valueToString,
        value,
        search,
        searchPlaceholder,
        onChange,
        maxHeight = 500,
        labelsContainHtml,
        hideEmptyOptionInDropdown,
        withEmptyOption,
        withPermanentOption,
        disableOptions = [],
        renderOptionLabel,
        trackBehaviorAs,
        selectFirstIfNotFound = true,
        virtualizationConfig = {enabled: false},
        // Dropdown
        onOpenChange: propsOnToggle,
        ...basicSelectInputProps
    } = props

    const inputRef = useRef<HTMLInputElement>(null)
    const keywordsInputRef = useRef<HTMLInputElement>(null)

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

    // Поиск выбранной опции.
    const selectedOption = useMemo(
        () => findSelectedOption<OptionValueType, OptionExtrasType>(
            options,
            value,
            withEmptyOption,
            withPermanentOption,
            selectFirstIfNotFound
        ),
        [
            options,
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
        propsOnToggle?.(open, event, reason)
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
                props.onChange(
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

    let virtualizationEnabled: boolean = false
    if (virtualizationConfig.enabled) {
        if (virtualizationConfig.enabled === 'auto') {
            virtualizationEnabled = options.length > 50
        }
    }

    return (
        <SelectInputBasic
            inputRef={inputRef}
            className={clsx(
                search ? 'with-search' : null,
                value === null || value === '' ? 'empty-option-selected' : null,
                className
            )}
            isDropdownToggle
            {...basicSelectInputProps}
            value={selectedValueForTextInput}
            onOpenChange={onDropdownToggle}
            maxHeight={null}
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
                        wrapperClass="m-0"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setKeywords({
                                value: e.target.value,
                                regexp: e.target.value.trim().length > 0
                                    ? new RegExp(
                                        e.target.value.trim()
                                            .replace(/[{}\][*?:'"()!@#$^%&+,;`<>/\\]/, '')
                                            .replace(/[её]/igu, '[её]')
                                            .replace(/\./, '\\.')
                                            .replace(/\s+/, '.*'),
                                        'igu'
                                    )
                                    : null,
                            })
                        }}
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
                    withEmptyOption={withEmptyOption}
                    withPermanentOption={withPermanentOption}
                    renderOptionLabel={renderOptionLabel}
                    keywordsRegexp={keywordsRegexp}
                    search={search}
                    height={Math.min(
                        virtualizationConfig.dropdownHeight ?? maxHeight ?? 500,
                        maxHeight ?? 500
                    )}
                    disableOptions={disableOptions}
                    onChange={onChange}
                />
            ) : (
                <SelectInputOptions<OptionValueType, OptionExtrasType>
                    options={options}
                    selectedOption={selectedOption?.option}
                    trackBehaviorAs={trackBehaviorAs}
                    labelsContainHtml={labelsContainHtml}
                    hideEmptyOptionInDropdown={hideEmptyOptionInDropdown}
                    withEmptyOption={withEmptyOption}
                    withPermanentOption={withPermanentOption}
                    renderOptionLabel={renderOptionLabel}
                    keywordsRegexp={keywordsRegexp}
                    search={search}
                    maxHeight={maxHeight}
                    disableOptions={disableOptions}
                    onChange={onChange}
                />
            )}
        </SelectInputBasic>
    )
}

/** @deprecated */
export default SelectInput
