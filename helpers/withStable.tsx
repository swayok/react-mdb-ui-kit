import {
    DependencyList,
    FunctionComponent,
    memo,
    MemoExoticComponent,
    useLayoutEffect,
    useMemo,
    useRef,
} from 'react'

// Imported from package https://www.npmjs.com/package/react-with-stable.

const Prefix: string = '__react-with-stable__'
const StableSymbol: string = `${Prefix}StableSymbol`
const DepsSymbol: string = `${Prefix}DepsSymbol`

/**
 * Поверхностное сравнение двух значений.
 */
function areEqual(a: any, b: any) {
    if (!(typeof a === 'function' &&
        a[DepsSymbol] &&
        typeof b === 'function' &&
        b[DepsSymbol])) {
        return a === b
    }
    const depsA = a[DepsSymbol]
    const depsB = b[DepsSymbol]
    for (const [i, itemA] of depsA.entries()) {
        if (!areEqual(itemA, depsB[i])) {
            return false
        }
    }
    return true
}

/**
 * Оптимизирует компонент, предотвращая ненужные перерисовки
 * из-за того что функции-обработчики событий пересоздаются в родительском
 * компоненте на каждую перерисовку, а также из-за любых перерисовок
 * родительского компонента, которые происходят, даже если props этого
 * компонента не изменяются (для этого используется React.memo()).
 *
 * В идеале нужно оборачивать все компоненты с функциями-обработчиками событий либо
 * в withStable(), если не нужен forwardRef(), либо в withStableAndRef() если нужен.
 */
export function withStable<ComponentProps extends object>(
    stableKeys: (keyof ComponentProps)[],
    Component: FunctionComponent<ComponentProps>
): MemoExoticComponent<FunctionComponent<ComponentProps>> {
    const stableSet = new Set(stableKeys as any)
    const Memo = memo(Component, (prev: ComponentProps, next: ComponentProps) => {
        for (const k in prev) {
            if (!(k in prev)) {
                continue
            }
            if (!areEqual(prev[k], next[k])) {
                return false
            }
        }
        for (const k in next) {
            if (!(k in next)) {
                continue
            }
            if (!areEqual(next[k], prev[k])) {
                return false
            }
        }
        return true
    })

    function ComponentWithStable(props: ComponentProps) {
        const propsRef = useRef<ComponentProps>(props)
        useLayoutEffect(() => {
            propsRef.current = props
        })
        const cache: Record<string, unknown> = useMemo(() => ({}), [])
        const stable: Record<string, unknown> = {}
        for (const k in props) {
            if (!(k in props)) {
                continue
            }
            stable[k] = ((): any => {
                if (typeof props[k] !== 'function') {
                    return props[k]
                }
                if (stableSet.has(k)) {
                    // @ts-ignore
                    if (props[k][StableSymbol]) {
                        return props[k]
                    }
                    if (cache[k]) {
                        return cache[k]
                    }
                    // @ts-ignore
                    cache[k] = (...args: any[]) => propsRef.current[k](...args)
                    // @ts-ignore
                    cache[k][StableSymbol] = true
                    return cache[k]
                }
                return props[k]
            })()
        }
        // @ts-ignore
        return React.createElement(Memo, Object.assign({}, stable))
    }

    // @ts-ignore
    return ComponentWithStable
}

/** @deprecated */
export default withStable

type Callback = (...args: any[]) => any

/**
 * Для функций-рендереров.
 * Компонент, в который передается функция, должен быть обернут в withStable()
 * или в withStableAndRef().
 * Функция не пересоздается, пока не изменятся deps.
 * Это предотвращает лишние перерисовки.
 */
export function depFn<T extends Callback>(
    callback: T,
    deps: DependencyList
): T {
    // @ts-ignore
    callback[DepsSymbol] = deps
    return callback
}

