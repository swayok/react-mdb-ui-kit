import {mdiCheck} from '@mdi/js'
import clsx from 'clsx'
import {
    ReactNode,
    useCallback,
    useRef,
} from 'react'
import {Button} from '../Button'
import {Dropdown} from '../Dropdown/Dropdown'
import {DropdownItem} from '../Dropdown/DropdownItem'
import {DropdownMenu} from '../Dropdown/DropdownMenu'
import {DropdownApi} from '../Dropdown/DropdownTypes'
import {Icon} from '../Icon'
import {Input} from '../Input/Input'
import {DataGridPaginationPagesListFillerDropdownProps} from './DataGridTypes'

// Выпадающее меню со списком всех номеров страниц для пагинатора.
// Пагинация выглядит так:
// [1] [2] [3] [...] [90] [91] [92],
// где [...] - родительский компонент, по нажатию на который отображается это меню.
export function DataGridPaginationPagesListFillerDropdown(
    props: DataGridPaginationPagesListFillerDropdownProps
) {
    const {
        currentPage,
        pagesCount,
        disabled,
        className,
        DropdownToggle,
        onPageSelect,
        ...wrapperProps
    } = props

    const dropdownApiRef = useRef<DropdownApi>(null)
    const pageNumberInputRef = useRef<HTMLInputElement>(null)

    const showPageNumberInputInFiller: boolean = pagesCount > 100

    // Открытие/закрытие меню.
    const onMenuToggle = useCallback((nextShow: boolean) => {
        if (showPageNumberInputInFiller) {
            if (nextShow) {
                setTimeout(() => {
                    pageNumberInputRef.current?.focus()
                }, 100)
            } else if (pageNumberInputRef.current) {
                pageNumberInputRef.current.value = ''
            }
        }
    }, [])

    let content: ReactNode | null
    if (showPageNumberInputInFiller) {
        content = (
            <DropdownMenu
                apiRef={dropdownApiRef}
                offset={6}
                drop="up"
                maxHeight={300}
                className="data-grid-pagination-filler-page-number-input"
                align="start"
            >
                <form
                    className="p-3 m-0 d-flex flex-row align-items-center gap-3"
                    onSubmit={e => {
                        e.preventDefault()
                        const value = normalizePageNumber(
                            pageNumberInputRef.current?.value ?? '',
                            pagesCount
                        )
                        if (value) {
                            pageNumberInputRef.current?.blur()
                            dropdownApiRef.current?.setIsOpen(
                                false,
                                e.nativeEvent,
                                'click'
                            )
                            onPageSelect(value)
                        }
                    }}
                >
                    <Input
                        allowedChars={/[0-9]/}
                        label={`1 - ${pagesCount}`}
                        inputRef={pageNumberInputRef}
                        wrapperClassName="m-0"
                        maxLength={pagesCount.toString().length}
                        disabled={disabled}
                        onBlur={e => {
                            const value = normalizePageNumber(
                                e.currentTarget.value,
                                pagesCount
                            )
                            // Исправляем неадекватные значения.
                            if (!value) {
                                e.currentTarget.value = ''
                            } else {
                                e.currentTarget.value = value.toString()
                            }
                        }}
                        onKeyDown={e => {
                            if (e.key === 'Esc') {
                                e.preventDefault()
                                dropdownApiRef.current?.setIsOpen(
                                    false,
                                    e.nativeEvent,
                                    'escape-key'
                                )
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        color="link"
                        hasIcon
                        disabled={disabled}
                    >
                        <Icon
                            path={mdiCheck}
                            color="green"
                            className="m-0"
                        />
                    </Button>
                </form>
            </DropdownMenu>
        )
    } else {
        let gridColumns = 10
        if (pagesCount < 30) {
            gridColumns = 5
        }
        const renderDropdownItems = () => {
            const dropdownItems = []
            for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber++) {
                dropdownItems.push(
                    <div
                        key={'page-number-' + pageNumber}
                        className={clsx(
                            'page-item text-center',
                            currentPage === pageNumber ? 'active' : null,
                            disabled ? 'disabled' : null
                        )}
                    >
                        <DropdownItem
                            tag="div"
                            className="page-link"
                            onClick={() => {
                                if (!disabled) {
                                    onPageSelect(pageNumber)
                                }
                            }}
                        >
                            {pageNumber}
                        </DropdownItem>
                    </div>
                )
            }
            return dropdownItems
        }
        content = (
            <DropdownMenu
                className="data-grid-pagination-filler-dropdown-menu"
                align="start"
            >
                <div
                    className="d-grid grid-columns-gap-2 grid-rows-gap-2 p-2 shadow-2-strong"
                    style={{
                        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                    }}
                >
                    {renderDropdownItems()}
                </div>
            </DropdownMenu>
        )
    }


    return (
        <div
            {...wrapperProps}
            className={className}
        >
            <Dropdown
                focusFirstItemOnOpen={false}
                autoClose={true}
                onOpenChange={onMenuToggle}
            >
                {DropdownToggle}
                {content}
            </Dropdown>
        </div>
    )
}

// Нормализация номера страницы.
function normalizePageNumber(value: string, pagesCount: number): number | null {
    if (value.trim().length > 0 && value.match(/^[0-9]+$/)) {
        const intValue = parseInt(value)
        if (intValue <= 0) {
            return null
        } else if (intValue > pagesCount) {
            return pagesCount
        }
        return intValue
    } else {
        return null
    }
}
