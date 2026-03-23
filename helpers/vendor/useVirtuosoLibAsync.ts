import {
    type ComponentType,
    type ReactNode,
    type Ref,
    useEffect,
    useState,
} from 'react'
import {
    type GroupedTableVirtuosoHandle as _GroupedTableVirtuosoHandle,
    type GroupedTableVirtuosoProps as _GroupedTableVirtuosoProps,
    type GroupedVirtuosoHandle as _GroupedVirtuosoHandle,
    type GroupedVirtuosoProps as _GroupedVirtuosoProps,
    type TableVirtuosoHandle as _TableVirtuosoHandle,
    type TableVirtuosoProps as _TableVirtuosoProps,
    type VirtuosoGridHandle as _VirtuosoGridHandle,
    type VirtuosoGridProps as _VirtuosoGridProps,
    type VirtuosoHandle as _VirtuosoHandle,
    type VirtuosoProps as _VirtuosoProps,
} from 'react-virtuoso'
import type {AnyObject} from '../../types'

function Placeholder(): ReactNode {
    return null
}

interface UseVirtuosoLibAsyncHookReturn<ItemData = AnyObject, Context = AnyObject | undefined | null> {
    Virtuoso: ComponentType<_VirtuosoProps<ItemData, Context> & {
        ref?: Ref<_VirtuosoHandle>
    }>
    TableVirtuoso: ComponentType<_TableVirtuosoProps<ItemData, Context> & {
        ref?: Ref<_TableVirtuosoHandle>
    }>
    GroupedVirtuoso: ComponentType<_GroupedVirtuosoProps<ItemData, Context> & {
        ref?: Ref<_GroupedVirtuosoHandle>
    }>
    GroupedTableVirtuoso: ComponentType<_GroupedTableVirtuosoProps<ItemData, Context> & {
        ref?: Ref<_GroupedTableVirtuosoHandle>
    }>
    // Не включен в react-virtuoso 4.x.x, но используется в 5.x.x и выше.
    VirtuosoGrid: ComponentType<_VirtuosoGridProps<ItemData, Context> & {
        ref?: Ref<_VirtuosoGridHandle>
    }>
}

// Асинхронная загрузка компонентов react-virtuoso.
export function useVirtuosoLibAsync<
    ItemData = AnyObject,
    Context = AnyObject | undefined | null,
>(): UseVirtuosoLibAsyncHookReturn<ItemData, Context> {

    const [
        virtuoso,
        setVirtuoso,
    ] = useState<UseVirtuosoLibAsyncHookReturn<ItemData, Context>>(() => ({
        Virtuoso: Placeholder,
        GroupedVirtuoso: Placeholder,
        TableVirtuoso: Placeholder,
        GroupedTableVirtuoso: Placeholder,
        VirtuosoGrid: Placeholder,
    }))

    useEffect(() => {
        import('react-virtuoso')
            .then(lib => setVirtuoso({
                Virtuoso: lib.Virtuoso,
                GroupedVirtuoso: lib.GroupedVirtuoso,
                TableVirtuoso: lib.TableVirtuoso,
                GroupedTableVirtuoso: lib.GroupedTableVirtuoso,
                VirtuosoGrid: lib.VirtuosoGrid,
            }))
            .catch(e => console.log('Failed to load react-virtuoso: ', e))
    }, [])

    return virtuoso
}

export type GroupedTableVirtuosoHandle = _GroupedTableVirtuosoHandle

export type GroupedTableVirtuosoProps<
    ItemData = AnyObject,
    Context = AnyObject | undefined | null,
> = _GroupedTableVirtuosoProps<ItemData, Context>

export type GroupedVirtuosoHandle = _GroupedVirtuosoHandle

export type GroupedVirtuosoProps<
    ItemData = AnyObject,
    Context = AnyObject | undefined | null,
> = _GroupedVirtuosoProps<ItemData, Context>

export type TableVirtuosoHandle = _TableVirtuosoHandle

export type TableVirtuosoProps<
    ItemData = AnyObject,
    Context = AnyObject | undefined | null,
> = _TableVirtuosoProps<ItemData, Context>

export type VirtuosoGridHandle = _VirtuosoGridHandle

export type VirtuosoGridProps<
    ItemData = AnyObject,
    Context = AnyObject | undefined | null,
> = _VirtuosoGridProps<ItemData, Context>

export type VirtuosoHandle = _VirtuosoHandle

export type VirtuosoProps<
    ItemData = AnyObject,
    Context = AnyObject | undefined | null,
> = _VirtuosoProps<ItemData, Context>
