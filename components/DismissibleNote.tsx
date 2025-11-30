import React, {useEffect, useState} from 'react'
import {Note, NoteProps} from './Note'
import ModalHeaderCloseButton from './Modal/ModalHeaderCloseButton'
import {Collapse} from './Collapse'

interface Props extends NoteProps {
    onDismissed?: () => void,
    visible?: boolean,
    collapseClassName?: string,
}

// Скрываемое уведомление.
export function DismissibleNote(props: Props) {

    const {
        visible,
        color = 'info',
        tag = 'div',
        className,
        collapseClassName,
        children,
        onDismissed,
        ...noteProps
    } = props

    // Видимость уведомления.
    const [
        isVisible,
        setIsVisible,
    ] = useState<boolean | null>(visible === undefined ? true : (!visible ? null : true))

    // Управление видимостью извне.
    // Через props.visible можно только скрыть уведомление.
    useEffect(() => {
        if (visible === false && isVisible === true) {
            setIsVisible(false)
        }
    }, [visible])

    if (isVisible === null) {
        // Скрыто.
        return null
    }

    return (
        <Collapse
            show={isVisible}
            showImmediately
            onTransitionEnd={opened => {
                if (!opened) {
                    setIsVisible(null)
                    onDismissed?.()
                }
            }}
            className={collapseClassName}
        >
            <div className={className}>
                <Note
                    {...noteProps}
                    tag={tag}
                    color={color}
                    className="m-0 flex-container-row"
                >
                    <div className="flex-1">{children}</div>
                    <div className="flex-shrink-0">
                        <ModalHeaderCloseButton onClose={() => setIsVisible(false)}/>
                    </div>
                </Note>
            </div>
        </Collapse>
    )
}

/** @deprecated */
export default DismissibleNote
