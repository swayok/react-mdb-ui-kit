export default class ApiRequestDebugService {

    private static setDebugModalContents: (html: string | null) => void | null

    static init(setDebugModalContents: (html: string | null) => void): void {
        ApiRequestDebugService.setDebugModalContents = setDebugModalContents
    }

    static setExceptionHtml(html: string | null) {
        ApiRequestDebugService.setDebugModalContents?.(html)
    }
}
