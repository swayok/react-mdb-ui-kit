import {
    useCallback,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
} from 'react'
import {flushSync} from 'react-dom'

export type SyncQueueTask = () => Promise<void> | void

export interface SyncQueueOptions {
    shouldProcess: boolean
    onFinished?: () => void
}

export interface SyncQueue {
    tasks: ReadonlyArray<SyncQueueTask>
    isProcessing: boolean
    addTask: (task: SyncQueueTask) => void
    reset: () => void
}

interface QueueState {
    isProcessing: boolean
    tasks: SyncQueueTask[]
}

const defaultOptions: SyncQueueOptions = {
    shouldProcess: true,
}

// Синхронная очередь заданий.
export function useSyncTaskQueue(params: SyncQueueOptions = defaultOptions): SyncQueue {

    const {
        shouldProcess,
        onFinished,
    } = params

    const [queue,
        setQueue] = useState<QueueState>({
        isProcessing: false,
        tasks: [],
    })

    const onEmptyQueue = useEffectEvent(() => {
        onFinished?.()
    })

    const queueHasStarted = useRef<boolean>(false)

    useEffect(() => {
        if (!shouldProcess || queue.isProcessing) {
            return
        }
        if (queue.tasks.length === 0) {
            if (queueHasStarted.current) {
                queueHasStarted.current = false
                onEmptyQueue()
            }
            return
        }

        const task = queue.tasks[0]
        setQueue(prev => ({
            isProcessing: true,
            tasks: prev.tasks.slice(1),
        }))

        queueHasStarted.current = true
        void Promise.resolve(task())
            .finally(() => {
                // Нужно отключить batching т.к. при быстрых задачах будет
                // потенциальная проблема: "Maximum update depth exceeded".
                flushSync(() => {
                    setQueue(prev => ({
                        isProcessing: false,
                        tasks: prev.tasks,
                    }))
                })
            })
    }, [queue, shouldProcess])

    return {
        tasks: queue.tasks,
        isProcessing: queue.isProcessing,
        addTask: useCallback(task => {
            setQueue(prev => ({
                isProcessing: prev.isProcessing,
                tasks: [...prev.tasks, task],
            }))
        }, []),
        reset: useCallback(() => {
            setQueue({
                isProcessing: false,
                tasks: [],
            })
        }, []),
    }
}
