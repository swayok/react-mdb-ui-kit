import {FunctionComponent, MouseEvent, useCallback, useEffect, useState} from 'react'
import {withStable} from '../helpers/withStable'
import {Collapse, CollapseProps} from './Collapse'

// Свойства кнопки открытия/закрытия для компонента <CollapsedContent>.
export interface CollapsedContentTogglerProps {
    // Текущее состояние видимости содержимого.
    opened: boolean,
    // Обработчик открытия/закрытия содержимого.
    onClick: (event?: MouseEvent<HTMLElement>) => void,
}

// Свойства компонента <CollapsedContent>.
export interface CollapsedContentProps extends Omit<CollapseProps, 'show'> {
    // Начальное состояние видимости содержимого.
    opened?: boolean;
    // Компонент кнопки открытия/закрытия содержимого.
    Toggler: FunctionComponent<CollapsedContentTogglerProps>,
}

// Скрываемое содержимое с кнопкой открытия/закрытия (свойство Toggler).
// Полезно использовать в древовидных меню, чтобы не нужно было выносить открытые ветки
// в состояние, при изменении которого, перерисовывались бы все компоненты в меню.
function CollapsedContent(props: CollapsedContentProps) {

    const {
        Toggler,
        opened: defaultState,
        children,
        ...collapseProps
    } = props

    const [
        opened,
        setOpened,
    ] = useState<boolean>(!!defaultState)

    // Мониторинг изменения свойства defaultState.
    useEffect(() => {
        setOpened(!!defaultState)
    }, [defaultState])

    // Открыть/закрыть содержимое.
    const toggle = useCallback(
        (event?: MouseEvent<HTMLElement>) => {
            event?.preventDefault()
            setOpened(value => !value)
        },
        []
    )

    return (
        <>
            <Toggler
                opened={opened}
                onClick={toggle}
            />
            <Collapse
                show={opened}
                {...collapseProps}
            >
                {children}
            </Collapse>
        </>
    )
}

export default withStable<CollapsedContentProps>(['onTransitionEnd'], CollapsedContent)
