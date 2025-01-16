// Выполнение всех заданий синхронно в порядке очереди.
export function runTasksSynchronously(
    tasks: (() => Promise<unknown>)[],
    // Если true, то ошибка при выполнении задания игнорируется, запуская следующее задание.
    // Если false или не задано, то выполнение прекращается, если хотя бы 1 задание завершается с ошибкой.
    // Если функция, то решение о продолжении определяется значением, которое возвращается из функции
    // Если функция возвращает true или undefined, то выполнение продолжается, если false - завершается.
    continueOnError: boolean | ((error: Error) => undefined | boolean) = false
): Promise<void> {
    return new Promise((resolve, reject) => {
        const runTask = (taskIndex: number) => {
            if (taskIndex >= tasks.length) {
                resolve()
                return
            }
            tasks[taskIndex]()
                .then(() => {
                    runTask(taskIndex + 1)
                })
                .catch((error: Error) => {
                    if (typeof continueOnError === 'function') {
                        const shouldContinue = continueOnError(error)
                        if (shouldContinue === true || shouldContinue === undefined) {
                            runTask(taskIndex + 1)
                        } else {
                            reject(error)
                        }
                    } else if (continueOnError) {
                        runTask(taskIndex + 1)
                    } else {
                        reject(error)
                    }
                })
        }
        runTask(0)
    })
}
