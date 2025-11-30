import React, {useDeferredValue, useEffect, useMemo, useRef, useState} from 'react'
import clsx from 'clsx'
import SelectInputBasic, {SelectInputBasicProps} from './SelectInputBasic'
import Input from '../../../components/Input/Input'
import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionOrGroup,
    FormSelectOptionsAndGroupsList,
} from 'swayok-react-mdb-ui-kit/types/Common'
import {withStable} from '../../../helpers/withStable'
import SelectInputOptions from './SelectInputOptions'
import {stripTags} from '../../../helpers/stripTags'
import {findSelectedOption} from '../../../helpers/findSelectedOption'
import {isSameOptionValue} from '../../../helpers/isSameOptionValue'
import VirtualizedSelectInputOptions from '../../../components/Input/SelectInput/VirtualizedSelectInputOptions'
import {UserBehaviorService} from '../../../services/UserBehaviorService'

export interface SelectInputProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> extends Omit<
    SelectInputBasicProps,
    'value' | 'onChange' | 'children'
> {
    // Набор опций.
    options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType>
    // Обработчик выбора опции.
    onChange: (
        value: OptionValueType,
        label: string,
        index: number,
        groupIndex: number | null,
        extra?: OptionExtrasType,
    ) => void
    // Текущее значение.
    value?: OptionValueType
    // Если value не найдено в options, то использовать первую активную опцию из options
    // и выполнить onChange(firstOption.value).
    // По умолчанию: true.
    selectFirstIfNotFound?: boolean
    // Конвертация опции для отображения в поле ввода (по умолчанию отображается FormSelectOption['label']).
    valueToString?: (option: FormSelectOption<OptionValueType, OptionExtrasType>) => string
    // Отрисовка подписи для опции или группы опций в выпадающем меню.
    renderOptionLabel?: (
        option: FormSelectOptionOrGroup<OptionValueType, OptionExtrasType>,
        isGroup: boolean
    ) => string | React.ReactNode
    // Задать true, если FormSelectOption['label'] может содержать HTML, а не только обычный текст.
    labelsContainHtml?: boolean
    // Вкл/Выкл поиска по опциям.
    search?: boolean
    // Пояснение для поля ввода ключевых слов поиска по опциям.
    searchPlaceholder?: string
    // Спрятать опцию с пустым value.
    hideEmptyOptionInDropdown?: boolean
    // Добавить опцию с пустым значением в список опций.
    withEmptyOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    // Добавить в конец списка опцию, которая будет видна,
    // даже при фильтрации списка опций.
    withPermanentOption?: FormSelectOption<OptionValueType, OptionExtrasType>
    // Отключить возможность выбрать указанные опции.
    disableOptions?: OptionValueType[]
    // Виртуализация списка опций для экономии памяти.
    // Проблема: если в опции суммарно занимают меньшую высоту, чем dropdownHeight,
    // то выпадающее меню всё-равно будет иметь высоту dropdownHeight, т.е. не уменьшится.
    virtualizationConfig?: {
        // Можно опционально включать виртуализацию в зависимости от кол-ва опций.
        // Если задано 'auto', то виртуализация будет включена, когда опций больше 50.
        enabled: boolean | 'auto'
        // Обязательное, если не указан SelectInputProps.maxHeight,
        // т.к. автоматически высота выпадающего меню не вычисляется.
        // По умолчанию: 500.
        // Если также указано значение SelectInputProps.maxHeight,
        // то будет выбрано меньшее из значений:
        // Math.min(props.maxHeight, props.virtualizeOptionsList.dropdownHeight).
        dropdownHeight?: number
    }
    // Отслеживать поведение пользователя в этом поле ввода.
    // Указывается имя ключа, под которым будут записаны действия пользователя в этом поле ввода.
    trackBehaviorAs?: string
}

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
function SelectInput<
    OptionValueType = string,
    OptionExtrasType = AnyObject
>(props: SelectInputProps<OptionValueType, OptionExtrasType>) {
    const {
        className,
        options = [],
        valueToString,
        value,
        search,
        searchPlaceholder,
        onChange,
        dropdownProps,
        maxHeight = 500,
        labelsContainHtml,
        hideEmptyOptionInDropdown,
        withEmptyOption,
        withPermanentOption,
        disableOptions = [],
        renderOptionLabel,
        trackBehaviorAs,
        dropdownFluidWidth = true,
        selectFirstIfNotFound = true,
        virtualizationConfig = {enabled: false},
        ...attributes
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
            dropdownFluidWidth={dropdownFluidWidth}
            {...attributes}
            value={selectedValueForTextInput}
            dropdownProps={{
                ...dropdownProps,
                onToggle(nextShow: boolean, meta) {
                    if (nextShow && trackBehaviorAs && inputRef.current) {
                        UserBehaviorService.onFocus(
                            inputRef.current,
                            trackBehaviorAs,
                            (value as string) || null
                        )
                    }
                    if (nextShow) {
                        setTimeout(() => {
                            keywordsInputRef.current?.focus()
                        }, 100)
                    } else {
                        setKeywords({
                            value: '',
                            regexp: null,
                        })
                    }
                    dropdownProps?.onToggle?.(nextShow, meta)
                },
            }}
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

export default withStable<SelectInputProps>(
    ['onChange', 'renderOptionLabel', 'valueToString'],
    props => <SelectInput {...props}/>
) as unknown as typeof SelectInput
