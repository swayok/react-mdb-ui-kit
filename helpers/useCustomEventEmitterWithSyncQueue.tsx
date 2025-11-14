import {useEffect, useMemo} from 'react'
import {CancelSubscriptionFn, CustomEventEmitter} from 'swayok-react-mdb-ui-kit/helpers/CustomEventEmitter'
import useSyncTaskQueue, {SyncQueueTask} from 'swayok-react-mdb-ui-kit/helpers/useSyncTaskQueue'

// Функции и данные, возвращаемые из хука useCustomEventEmitterWithSyncQueue()
export interface CustomEventEmitterWithSyncQueueHookReturn<Payload = undefined> {
    emit: CustomEventEmitter<Payload>['emit']
    unsubscribeAll: CustomEventEmitter<Payload>['reset']
    subscribe: (callback: SyncQueueTask, once?: boolean) => CancelSubscriptionFn
    once: (callback: SyncQueueTask) => CancelSubscriptionFn
    resetQueue: () => void
    isProcessing: boolean
    tasks: ReadonlyArray<SyncQueueTask>
}

// Параметры для хука useCustomEventEmitterWithSyncQueue()
export interface CustomEventEmitterWithSyncQueueHookParams {
    onQueueFinished?: () => void
}

const defaultParams: CustomEventEmitterWithSyncQueueHookParams = {
}

/**
 * Получить CustomEventEmitter для компонента.
 * При вызове emit() все обработчики будут выполняться последовательно, ожидая выполнения предыдущего.
 * Комбинация useCustomEventEmitter() и useSyncTaskQueue().
 *
 * @see useSyncTaskQueue().
 */
export function useCustomEventEmitterWithSyncQueue<Payload = undefined>(
    params: CustomEventEmitterWithSyncQueueHookParams = defaultParams
): CustomEventEmitterWithSyncQueueHookReturn<Payload> {

    const {
        onQueueFinished
    } = params

    const emitter = useMemo(() => new CustomEventEmitter<Payload>(), [])
    const queue = useSyncTaskQueue({
        shouldProcess: true,
        onFinished: onQueueFinished
    })

    // Сброс всех подписок при демонтаже компонента.
    useEffect(() => () => {
        emitter.reset()
        queue.tasks
    }, [])

    const api: Omit<CustomEventEmitterWithSyncQueueHookReturn<Payload>, 'isProcessing' | 'tasks'> = useMemo(
        () => {
            return {
                emit: emitter.emit,
                unsubscribeAll: emitter.reset,
                subscribe: (task, once = false) => emitter.subscribe(() => queue.addTask(task), once),
                once: task => emitter.once(() => queue.addTask(task)),
                resetQueue: queue.reset,
            }
        },
        []
    )

    return {
        ...api,
        isProcessing: queue.isProcessing,
        tasks: queue.tasks,
    }
}
