import React, {useCallback} from 'react'
import {AnyObject, FormSelectOption, FormSelectOptionGroup, FormSelectOptionsAndGroupsList} from '../../../types/Common'
import clsx from 'clsx'
import {SelectInputProps} from './SelectInput'
import withStable from '../../../helpers/withStable'
import SelectInputOptionsGroupHeader from '../../../components/Input/SelectInput/SelectInputOptionsGroupHeader'
import SelectInputOption from '../../../components/Input/SelectInput/SelectInputOption'
import shouldDisplaySelectInputOption from '../../../components/Input/SelectInput/shouldDisplaySelectInputOption'
import UserBehaviorService from '../../../services/UserBehaviorService'

export interface SelectInputOptionsProps<
    OptionValueType = string,
    OptionExtrasType = AnyObject
> extends Pick<
    SelectInputProps<OptionValueType, OptionExtrasType>,
    'options' | 'withEmptyOption' | 'withPermanentOption' | 'hideEmptyOptionInDropdown'
    | 'maxHeight'  | 'search' | 'renderOptionLabel' | 'labelsContainHtml'
    | 'disableOptions' | 'onChange' | 'trackBehaviorAs'
> {
    selectedOption?: FormSelectOption<OptionValueType, OptionExtrasType>,
    keywordsRegexp: RegExp | null,
}

// Отрисовка списка опций для SelectInput.
function SelectInputOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject
>(props: SelectInputOptionsProps<OptionValueType, OptionExtrasType>) {

    const {
        options,
        selectedOption,
        withEmptyOption,
        withPermanentOption,
        maxHeight,
        hideEmptyOptionInDropdown,
        search,
        keywordsRegexp,
        labelsContainHtml,
        disableOptions,
        onChange,
        trackBehaviorAs,
        renderOptionLabel,
    } = props

    // Обработчик выбора опции.
    const onSelect = useCallback(
        (
            option: FormSelectOption<OptionValueType, OptionExtrasType>,
            index: number,
            groupIndex: number | null
        ) => {
            onChange(option.value, option.label, index, groupIndex, option.extra)
            if (trackBehaviorAs) {
                UserBehaviorService.onBlur(String(option.value))
            }
        },
        [onChange, trackBehaviorAs]
    )

    // Рекурсивная отрисовка опций.
    const renderOptions = (
        options: FormSelectOptionsAndGroupsList<OptionValueType, OptionExtrasType> = [],
        groupIndex: null | number = null,
        depth: number = 0
    ) => {
        const ret = []

        for (let i = 0; i < options.length; i++) {
            if ('options' in options[i]) {
                const group = options[i] as FormSelectOptionGroup<OptionValueType, OptionExtrasType>
                // Группа опций.
                const {
                    className: containerClassName,
                    ...optionsContainerAttributes
                } = (group.optionsContainerAttributes ?? {})

                if (group.options.length === 0) {
                    // Пропускаем пустую группу.
                    continue
                }

                const groupChildren = renderOptions(group.options, i, depth + 1)
                if (groupChildren.length === 0) {
                    continue
                }

                ret.push(
                    <SelectInputOptionsGroupHeader
                        key={'group-' + i}
                        group={group}
                        index={i}
                        renderOptionLabel={renderOptionLabel}
                        labelContainsHtml={labelsContainHtml}
                    />,
                    <div
                        key={'group-options-' + i}
                        {...optionsContainerAttributes}
                        className={clsx(
                            'form-dropdown-select-options-in-group ps-3',
                            'depth-' + (depth + 1),
                            containerClassName
                        )}
                    >
                        {groupChildren}
                    </div>
                )
            } else {
                const option: FormSelectOption<OptionValueType, OptionExtrasType> = options[i] as FormSelectOption<OptionValueType, OptionExtrasType>
                if (!shouldDisplaySelectInputOption(
                    option.label,
                    option.value,
                    hideEmptyOptionInDropdown,
                    search,
                    keywordsRegexp,
                    labelsContainHtml
                )) {
                    continue
                }
                ret.push(
                    <SelectInputOption
                        key={'option-' + i}
                        option={option}
                        index={i}
                        groupIndex={groupIndex}
                        isActive={selectedOption?.value === option.value}
                        renderOptionLabel={renderOptionLabel}
                        labelContainsHtml={labelsContainHtml}
                        disabled={option.disabled ?? disableOptions?.includes(option.value)}
                        onSelect={onSelect}
                    />
                )
            }
        }
        return ret
    }

    const content = (
        <>
            {withEmptyOption && !hideEmptyOptionInDropdown && (
                <SelectInputOption
                    key="option-empty"
                    option={withEmptyOption}
                    index={-1}
                    groupIndex={null}
                    isActive={selectedOption?.value === withEmptyOption.value}
                    renderOptionLabel={renderOptionLabel}
                    labelContainsHtml={labelsContainHtml}
                    onSelect={onSelect}
                />
            )}
            {renderOptions(options)}
            {withPermanentOption && (
                <SelectInputOption
                    key="option-permanent"
                    option={withPermanentOption}
                    index={-1}
                    groupIndex={null}
                    isActive={selectedOption?.value === withPermanentOption.value}
                    renderOptionLabel={renderOptionLabel}
                    labelContainsHtml={labelsContainHtml}
                    onSelect={onSelect}
                />
            )}
        </>
    )

    if (maxHeight && maxHeight > 0) {
        return (
            <div
                className="overflow-y-auto"
                style={{maxHeight}}
            >
                {content}
            </div>
        )
    } else {
        return content
    }
}

export default withStable<SelectInputOptionsProps>(
    ['onChange', 'renderOptionLabel'],
    SelectInputOptions
) as typeof SelectInputOptions
