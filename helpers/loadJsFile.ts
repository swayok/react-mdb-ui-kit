// Загрузка JS файла через добавление <script src="${url}" async/> в <head>.
export function loadJsFile(url: string): Promise<Event> {
    return new Promise((resolve, reject): void => {
        const script: HTMLScriptElement = document.createElement('script')
        script.src = url
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
    })
}
