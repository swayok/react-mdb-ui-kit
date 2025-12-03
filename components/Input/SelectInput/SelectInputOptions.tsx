import clsx from 'clsx'
import React, {useCallback} from 'react'
import {
    AnyObject,
    FormSelectOption,
    FormSelectOptionGroup,
    FormSelectOptionsAndGroupsList,
} from '../../../types'
import {withStable} from '../../../helpers/withStable'
import {UserBehaviorService} from '../../../services/UserBehaviorService'
import {SelectInputOption} from './SelectInputOption'
import {SelectInputOptionsGroupHeader} from './SelectInputOptionsGroupHeader'
import {SelectInputOptionsProps} from './SelectInputTypes'
import {shouldDisplaySelectInputOption} from './shouldDisplaySelectInputOption'

// Отрисовка списка опций для SelectInput.
function _SelectInputOptions<
    OptionValueType = string,
    OptionExtrasType = AnyObject,
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
                const option: FormSelectOption<
                    OptionValueType,
                    OptionExtrasType
                > = options[i] as FormSelectOption<OptionValueType, OptionExtrasType>
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

export const SelectInputOptions = withStable<SelectInputOptionsProps>(
    ['onChange', 'renderOptionLabel'],
    _SelectInputOptions
) as typeof _SelectInputOptions
