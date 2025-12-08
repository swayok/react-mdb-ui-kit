import {
    RefObject,
    useMemo,
    Ref,
    RefCallback,
} from 'react'

export type PossibleRef<T> = Ref<T> | undefined

export function assignRef<T>(
    ref: PossibleRef<T>,
    value: T
) {
    if (ref == null) {
        return
    }

    if (typeof ref === 'function') {
        ref(value)
        return
    }

    try {
        (ref as RefObject<T>).current = value
    } catch (_) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-base-to-string
        throw new Error(`Cannot assign value '${value}' to ref '${ref}'`)
    }
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
    return (node: T | null) => {
        refs.forEach(ref => {
            assignRef(ref, node)
        })
    }
}

/**
 * Возвращает функцию, которая позволяет объединять несколько RefObject/RefCallback.
 */
export function useMergedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {

    return useMemo(() => mergeRefs(...refs), refs)
}
