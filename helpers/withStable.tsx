/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
import React, {DependencyList, forwardRef, FunctionComponent, MemoExoticComponent} from 'react'
import {AnyObject} from '../types/Common'

// Imported from package https://www.npmjs.com/package/react-with-stable.

const Prefix: string = '__react-with-stable__'
const StableSymbol: string = `${Prefix}StableSymbol`
const DepsSymbol: string = `${Prefix}DepsSymbol`

export type PropsWithForwardedRef<Props, HtmlElementType extends HTMLElement | null = HTMLElement> = React.PropsWithoutRef<Props> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forwardedRef: Props extends any
        ? ('ref' extends keyof Props ? Props['ref'] : React.ForwardedRef<HtmlElementType | null>)
        : React.ForwardedRef<HtmlElementType | null>;
}

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
export default function withStable<ComponentProps extends object>(
    stableKeys: (keyof ComponentProps)[],
    Component: FunctionComponent<ComponentProps>
): MemoExoticComponent<FunctionComponent<ComponentProps>> {
    const stableSet = new Set(stableKeys as any)
    const Memo = React.memo(Component, (prev: ComponentProps, next: ComponentProps) => {
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
        const propsRef = React.useRef<ComponentProps>(props)
        React.useLayoutEffect(() => {
            propsRef.current = props
        })
        const cache: AnyObject = React.useMemo(() => ({}), [])
        const stable: AnyObject = {}
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

/**
 * Оборачивает компонент в forwardRef() и withStable().
 * Подробнее: смотри описание withStable().
 *
 * В идеале нужно оборачивать все компоненты с функциями-обработчиками событий либо
 * в withStable(), если не нужен forwardRef(), либо в withStableAndRef() если нужен.
 */
export function withStableAndRef<
    ComponentProps extends object,
    HtmlElementType extends HTMLElement | null
>(
    stableProps: (keyof ComponentProps)[],
    Component: FunctionComponent<PropsWithForwardedRef<ComponentProps, HtmlElementType>>,
    displayName: string
): React.ForwardRefExoticComponent<React.PropsWithoutRef<ComponentProps> & React.RefAttributes<HtmlElementType>> {

    const StableComponent = withStable<ComponentProps>(
        stableProps,
        Component as FunctionComponent<ComponentProps>
    )

    const ComponentWithRef = forwardRef<HtmlElementType, ComponentProps>(
        // @ts-ignore
        (props: ComponentProps, ref: React.ForwardedRef<HtmlElementType | null>) =>
            React.createElement<ComponentProps & PropsWithForwardedRef<HtmlElementType>>(
                // @ts-ignore
                StableComponent,
                // @ts-ignore
                Object.assign({forwardedRef: ref}, props)
            )
    )

    ComponentWithRef.displayName = displayName

    return ComponentWithRef
}
