import {useEffect, useState} from 'react'

function Placeholder() {
    return (
        <></>
    )
}

type HookReturn = Pick<
    typeof import('react-virtuoso/dist/index'),
    'Virtuoso' | 'VirtuosoGrid' | 'GroupedVirtuoso' | 'TableVirtuoso'
>

// Асинхронная загрузка компонентов react-virtuoso.
export default function useVirtuosoLibAsync(): HookReturn {

    const [
        virtuoso,
        setVirtuoso,
    ] = useState<HookReturn>(() => ({
        Virtuoso: Placeholder,
        GroupedVirtuoso: Placeholder,
        TableVirtuoso: Placeholder,
        VirtuosoGrid: Placeholder,
    }))

    useEffect(() => {
        import('react-virtuoso')
            .then(lib => setVirtuoso({
                Virtuoso: lib.Virtuoso,
                GroupedVirtuoso: lib.GroupedVirtuoso,
                TableVirtuoso: lib.TableVirtuoso,
                VirtuosoGrid: lib.VirtuosoGrid,
            }))
            .catch(e => console.log('Failed to load react-virtuoso: ', e))
    }, [])

    return virtuoso
}
