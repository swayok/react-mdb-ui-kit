import {useEffect} from 'react'
import {scrollToTop, ScrollBehavior} from '../helpers/scrollToTop'

type Props = {
    behavior?: ScrollBehavior,
    container?: HTMLElement | null,
}

// При монтировании этого компонента, скроллинг страницы будет перемещен в начало.
export function ScrollToTop(props: Props) {

    const {
        behavior = 'smooth',
        container
    } = props

    useEffect(() => {
        scrollToTop(behavior, container)
    }, [])

    return null
}

/** @deprecated */
export default ScrollToTop
