import React, {useCallback, useEffect, useRef, useState} from 'react'
import clsx from 'clsx'
import ReactDOM from 'react-dom'
import ModalDialog from './ModalDialog'
import {ModalProps} from '../../types/Modals'
import withStable from '../../helpers/withStable'

// Отслеживание количества открытых окон для управления скролбаром страницы.
export let openedModals: number = 0

// Обертка модального окна (затемнение фона страницы).
// Самый внешний элемент, отвечает за монтирование окна в документ и взаимодействие
// с внешними компонентами и документом.
// Внутри должен быть компонент ModalDialog (добавляется автоматически если props.noDialog !== true).
// Стандартная структура:
// Modal
//      ModalDialog
//          ModalContent
//              ModalHeader
//                  ModalTitle
//                  ModalHeaderCloseButton
//              ModalBody
//                  содержимое
//              ModalFooter
//                  Button
//                  ModalFooterCloseButton
function Modal(props: ModalProps) {
    const {
        backdrop = true,
        depth = 1,
        children,
        render,
        className,
        onClose,
        onClosed,
        onShown,
        onShow,
        modalRef,
        show,
        staticBackdrop,
        closeOnEsc,
        noDialog,
        centered = true,
        size,
        scrollable,
        dialogClassName,
        dialogId,
        dialogProps,
        container,
        ...otherProps
    } = props

    const [isOpenBackdrop, setIsOpenBackdrop] = useState<boolean>(false)
    const [isOpenModal, setIsOpenModal] = useState<boolean | null>(null)
    const [innerShow, setInnerShow] = useState<boolean | null>(null)
    const [staticModal, setStaticModal] = useState<boolean>(false)

    const modalInnerRef = useRef<HTMLDivElement>(null)
    const modalReference = modalRef ?? modalInnerRef

    const classes = clsx(
        'modal',
        staticModal && 'modal-static',
        'fade in',
        isOpenModal && 'show',
        'depth-' + depth,
        className
    )
    const backdropClasses = clsx('modal-backdrop', 'fade', isOpenBackdrop && 'show', 'depth-' + depth)

    useEffect(() => {
        setIsOpenModal(show ?? null)
    }, [])

    const closeModal = useCallback((inner: boolean) => {
        setIsOpenModal(false)
        if (inner) {
            onClose?.()
        }

        setTimeout(() => {
            setIsOpenBackdrop(false)
        }, 150)
        setTimeout(() => {
            setInnerShow(false)
            onClosed?.()
        }, 350)
    }, [onClose, onClosed])

    const showModal = useCallback(() => {
        setInnerShow(true)

        setTimeout(() => {
            setIsOpenBackdrop(true)
            onShow?.()
        }, 0)
        setTimeout(() => {
            setIsOpenModal(true)
            onShown?.()
        }, 150)
    }, [onShow, onShown])

    useEffect(() => {
        const getScrollbarWidth = (): number => {
            const documentWidth = document.documentElement.clientWidth
            return Math.abs(window.innerWidth - documentWidth)
        }

        // const hasVScroll: boolean = (
        //     scrollbarWidth > 0
        //     && window.innerWidth >= 576
        // )

        // if (innerShow && hasVScroll) {
        if (innerShow) {
            const scrollbarWidth = getScrollbarWidth()
            document.body.classList.add('modal-open')
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${scrollbarWidth}px`
        } else if (depth === 1 || openedModals === 0) {
            document.body.classList.remove('modal-open')
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }
    }, [innerShow])

    useEffect(() => {
        if (show === null) {
            return
        }
        if (show === innerShow) {
            return
        }
        if (show) {
            openedModals += 1
            showModal()
        } else {
            if (innerShow !== null) {
                openedModals = Math.max(0, openedModals - 1)
            }
            closeModal(false)
        }
    }, [show, closeModal, showModal])

    useEffect(() => () => {
        if (innerShow) {
            openedModals = Math.max(0, openedModals - 1)
        }
    }, [])

    useEffect(() => {
        const abortController = new AbortController()

        window.addEventListener(
            'click',
            (event: MouseEvent) => {
                if (isOpenModal && event.target === modalReference.current) {
                    if (!staticBackdrop) {
                        closeModal(true)
                    } else {
                        // setStaticModal(true);
                        // setTimeout(() => {
                        //     setStaticModal(false);
                        // }, 300);
                    }
                }
            },
            {signal: abortController.signal}
        )

        window.addEventListener(
            'keydown',
            (event: KeyboardEvent) => {
                if (isOpenModal && event.key === 'Escape') {
                    if (closeOnEsc) {
                        closeModal(true)
                    } else {
                        setStaticModal(true)
                        setTimeout(() => {
                            setStaticModal(false)
                        }, 300)
                    }
                }
            },
            {signal: abortController.signal}
        )

        return () => {
            abortController.abort()
        }
    }, [closeOnEsc, staticBackdrop, isOpenModal, closeModal])

    if (show === null) {
        return null
    }

    const renderDialogAndChildren = () => {
        if (noDialog) {
            if (!render) {
                return children
            }
            return typeof render === 'function' ? render() : render
        }
        let content = null
        if (innerShow !== null) {
            if (render) {
                content = typeof render === 'function' ? render() : render
            } else {
                content = children
            }
        }
        return (
            <ModalDialog
                {...dialogProps}
                size={size}
                centered={centered}
                scrollable={scrollable}
                className={dialogClassName}
                id={dialogId}
            >
                {content}
            </ModalDialog>
        )
    }

    let modalsContainer: HTMLElement = document.body
    if (typeof container === 'string') {
        modalsContainer = document.getElementById(container) ?? document.body
    }

    return (
        <>
            {ReactDOM.createPortal(
                (
                    <div
                        className={classes}
                        ref={modalReference}
                        style={{display: innerShow || show ? 'block' : 'none'}}
                        tabIndex={-1}
                        {...otherProps}
                    >
                        {renderDialogAndChildren()}
                    </div>
                ),
                modalsContainer
            )}
            {ReactDOM.createPortal(backdrop && innerShow && <div className={backdropClasses}/>, modalsContainer)}
        </>
    )
}

export default withStable<ModalProps>(
    ['onShow', 'onShown', 'onClose', 'onClosed'],
    Modal
)
