import React from 'react'
import scrollToTop, {ScrollBehavior} from '../helpers/scrollToTop'

type Props = {
    behavior?: ScrollBehavior,
    container?: HTMLElement | null,
}

// При монтировании этого компонента, скроллинг страницы будет перемещен в начало.
function ScrollToTop(props: Props) {
    React.useEffect(() => {
        scrollToTop(props.behavior || 'smooth', props.container)
    }, [])

    return null
}

export default React.memo(ScrollToTop)
