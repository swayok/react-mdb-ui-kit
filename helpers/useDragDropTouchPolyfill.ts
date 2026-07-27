import {useEffect} from 'react'

// Полифил для мобильных устройств для имитации drag-and-drop событий из touch событий.
export function useDragDropTouchPolyfill() {
    useEffect(() => {
        void import('drag-drop-touch')
    }, [])
}
