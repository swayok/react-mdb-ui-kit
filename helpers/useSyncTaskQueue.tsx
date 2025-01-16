import {useCallback, useEffect, useState} from 'react'
import {flushSync} from 'react-dom'

type Task = () => Promise<void> | void

export type SyncQueueOptions = {
    shouldProcess: boolean
}

export type SyncQueue = {
    tasks: ReadonlyArray<Task>
    isProcessing: boolean
    addTask: (task: Task) => void
}

type QueueState = {
    isProcessing: boolean
    tasks: Task[]
}

const defaultOptions: SyncQueueOptions = {
    shouldProcess: true,
}

// Синхронная очередь заданий.
export default function useSyncTaskQueue(params: SyncQueueOptions = defaultOptions): SyncQueue {
    const [queue, setQueue] = useState<QueueState>({
        isProcessing: false,
        tasks: [],
    })

    useEffect(() => {
        if (!params.shouldProcess) {
            return
        }
        if (queue.tasks.length === 0) {
            return
        }
        if (queue.isProcessing) {
            return
        }

        const task = queue.tasks[0]
        setQueue(prev => ({
            isProcessing: true,
            tasks: prev.tasks.slice(1),
        }))

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
    }, [queue, params.shouldProcess])

    return {
        tasks: queue.tasks,
        isProcessing: queue.isProcessing,
        addTask: useCallback(task => {
            setQueue(prev => ({
                isProcessing: prev.isProcessing,
                tasks: [...prev.tasks, task],
            }))
        }, []),
    }
}

