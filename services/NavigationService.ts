import {useEffect} from 'react'
import {
    Location,
    NavigateFunction,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import {makeUrl} from '../helpers/makeUrl'
import {AnyObject} from '../types'

type ExtractRouteParam<Path, NextPart> = Path extends `:${infer Param}`
    ? Record<Param, string> & NextPart
    : NextPart

export type ExtractRouteParams<Path> = Path extends `${infer Segment}/${infer Rest}`
    ? ExtractRouteParam<Segment, ExtractRouteParams<Rest>>
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    : ExtractRouteParam<Path, {}>

export interface NavigationServiceConfig {
    // URL без локали.
    rootUrl: string
    // URL с локалью.
    baseUrl: string
    baseApiUrl: string
    defaultPrivateUrl: string | ((permissions?: object) => string)
}

export type NavigationCallback = (url: Location) => void

// Сервис навигации по страницам.
export class NavigationService {

    private static config: NavigationServiceConfig = {
        rootUrl: '/',
        baseUrl: '/',
        baseApiUrl: '/api',
        defaultPrivateUrl: '/account',
    }
    // Функция для перехода между страницами.
    private static navigator: NavigateFunction | null = null
    // Текущая страница.
    private static location: Location | null = null
    // Ключ страницы с вложенным обработчиком навигации внутри (пример: ЛК пользователя).
    private static nestedLocationKey: null | string = null
    // Если на этапе запроса перенаправления не задан еще навигатор, то
    // перенаправление будет отложено в это свойство.
    private static navigateAfterNavigatorAppearsTo: null | (() => void)
    // Функции, которые требуется выполнять при переходе между страницами.
    private static navigationCallbacks: AnyObject<NavigationCallback> = {}

    // Конфигурация сервиса.
    static configure(config: NavigationServiceConfig): void {
        config.rootUrl = config.rootUrl.replace(/\/$/, '') + '/'
        config.baseUrl = config.baseUrl.replace(/\/$/, '') + '/'
        config.baseApiUrl = config.baseApiUrl.replace(/\/$/, '') + '/'
        if (typeof config.defaultPrivateUrl === 'function') {
            const originalFn = config.defaultPrivateUrl
            config.defaultPrivateUrl = permissions => originalFn(permissions).replace(/\/$/, '')
        } else {
            config.defaultPrivateUrl = config.defaultPrivateUrl.replace(/\/$/, '')
        }
        this.config = config
    }

    // Сохранение функции для перехода между страницами.
    static setNavigator(navigator: NavigateFunction): void {
        this.navigator = navigator
        if (this.navigateAfterNavigatorAppearsTo) {
            const callback = this.navigateAfterNavigatorAppearsTo
            this.navigateAfterNavigatorAppearsTo = null
            callback()
        }
    }

    // Сохранение данных текущей страницы.
    static setLocation(location: Location): void {
        if (this.location === location) {
            return
        }
        console.log('[Router] Current location: ' + JSON.stringify(location, null, 2))
        const oldLocation: Location | null = this.location
        this.location = location

        // Запускаем зарегистрированные функции в отдельном потоке,
        // чтобы не мешать выполнению основного функционала.
        setTimeout(() => {
            if (oldLocation && this.makeUrlFromLocation(oldLocation) === this.makeUrlFromLocation(location)) {
                // URL не изменился.
                return
            }
            for (const navigationCallbacksKey in this.navigationCallbacks) {
                try {
                    this.navigationCallbacks[navigationCallbacksKey](location)
                } catch (e) {
                    console.log(`[NavigationService] navigationCallbacks.${navigationCallbacksKey}() error: `, e)
                }
            }
        }, 100)
    }

    // Добавить функцию, которую нужно вызывать при изменении локации.
    static registerNavigationCallback(name: string, callback: NavigationCallback): void {
        this.navigationCallbacks[name] = callback
    }

    // Удалить функцию, которую нужно вызывать при изменении локации.
    static removeNavigationCallback(name: string): void {
        delete this.navigationCallbacks[name]
    }

    // Получить текущую локацию.
    static getLocation(): Location | null {
        return this.location!
    }

    // Задать ключ страницы с вложенным обработчиком навигации внутри.
    static setNestedLocationKey(locationKey: string | null): void {
        this.nestedLocationKey = locationKey
    }

    // Ключ страницы с вложенным обработчиком навигации внутри.
    static getNestedLocationKey(): string | null {
        return this.nestedLocationKey
    }

    // Переход на страницу.
    static navigate<QueryArgsType extends object = AnyObject<string>>(
        relativeUrl: string,
        params: ExtractRouteParams<string> | null = null,
        queryArgs: QueryArgsType | null = null,
        from: Location | null = null
    ): void {
        this._navigate('navigate', relativeUrl, params, queryArgs, from)
    }

    // Замена текущей страницы.
    static replace<QueryArgsType extends Record<string, string> = AnyObject<string>>(
        relativeUrl: null | string,
        params: ExtractRouteParams<string> | null = null,
        queryArgs: QueryArgsType | null = null
    ): void {
        this._navigate(
            'replace',
            relativeUrl ?? this.location?.pathname ?? '/',
            params,
            queryArgs
        )
    }

    // Вернуться на предыдущую страницу или на fallbackUrl.
    static goBack(fallbackUrl?: string) {
        if (!this.navigator) {
            console.error('Navigation function not provided (go back action)')
            return
        }
        if (
            (window.history.state && window.history.state.idx > 0)
            || !fallbackUrl
        ) {
            void this.navigator(-1)
        } else {
            this.replace(fallbackUrl)
        }
    }

    // Перезагрузка текущей страницы.
    static reload() {
        if (!this.location) {
            console.error('Current location not provided (reload action)')
            return
        }
        this.replace(
            this.makeUrlFromLocation(this.location)
        )
    }

    // Переход на страницу, запрошенную до перенаправления на авторизацию.
    static navigateToIntendedUrl(permissions?: Record<string, boolean | undefined>) {
        this._navigate('replace', this.getIntendedUrl(permissions))
    }

    // Перезагрузка страницы не используя React Router.
    static hardReload() {
        document.location.reload()
    }

    // Переход на страницу.
    private static _navigate<QueryArgsType extends object = AnyObject<string>>(
        action: 'navigate' | 'replace',
        relativeUrl: string,
        params: ExtractRouteParams<string> | null = null,
        queryArgs: QueryArgsType | null = null,
        from: Location | null = null
    ): void {
        if (!this.navigator) {
            this.navigateAfterNavigatorAppearsTo = () => {
                this._navigate(action, relativeUrl, params, queryArgs, from)
            }
            return
        }
        const url: string = this.makeUrl(
            relativeUrl.replace(new RegExp('^(http.+)?' + this.config.baseUrl), ''),
            params,
            queryArgs
        )
        console.log(
            '[NavigationService][' + action + ']',
            JSON.stringify({relativeUrl, params, queryArgs, url}, null, 2)
        )

        void this.navigator(url, {
            replace: action === 'replace',
            state: from ? {from} : undefined,
        })
    }

    // Сборка относительного URL из частей.
    static makeUrl<QueryArgsType extends object = AnyObject<string>>(
        relativeUrl: string,
        params: ExtractRouteParams<string> | null = null,
        queryArgs: QueryArgsType | null = null
    ): string {
        return makeUrl(relativeUrl, params, queryArgs)
    }

    // Сборка абсолютного URL из частей.
    static makeFullUrl<QueryArgsType extends object = AnyObject<string>>(
        relativeUrl: string,
        params: ExtractRouteParams<string> | null = null,
        queryArgs: QueryArgsType | null = null,
        useRootUrl: boolean = false
    ): string {
        return (useRootUrl ? this.config.rootUrl : this.config.baseUrl)
            + this.makeUrl(relativeUrl, params, queryArgs).replace(/^\//, '')
    }

    // Сборка абсолютного URL для API из частей.
    static makeFullApiUrl<QueryArgsType extends object = AnyObject<string>>(
        relativeUrl: string,
        params: ExtractRouteParams<string> | null = null,
        queryArgs: QueryArgsType | null = null
    ): string {
        return this.config.baseApiUrl
            + this.makeUrl(relativeUrl, params, queryArgs).replace(/^\//, '')
    }

    // Получение URL, запрошенного до перенаправления на авторизацию.
    static getIntendedUrl(permissions?: Record<string, boolean | undefined>): string {
        const location = this.location
        if (
            location?.state?.from?.pathname
            && location?.pathname !== location?.state?.from?.pathname
        ) {
            // console.log('A', location.state.from)
            // Перенаправление на запрошенный ранее URL.
            const from: Location = location.state.from
            return this.makeUrlFromLocation(from)
        } else {
            // console.log('B', this.config.defaultPrivateUrl, typeof this.config.defaultPrivateUrl === 'function'
            //     ? this.config.defaultPrivateUrl(permissions)
            //     : this.config.defaultPrivateUrl)
            return typeof this.config.defaultPrivateUrl === 'function'
                ? this.config.defaultPrivateUrl(permissions)
                : this.config.defaultPrivateUrl
        }
    }

    // Создание относительного URL из данных локации.
    static makeUrlFromLocation(location: Location): string {
        return location.pathname + location.search + location.hash
    }

    // Создание абсолютного URL (https://{domain}...) из данных локации.
    static makeAbsoluteUrlFormLocation(location: Location): string {
        return (
            document.location.origin
            + this.config.baseUrl
            + this.makeUrlFromLocation(location).replace(/(^\/)/, '')
        ).replace(/\/+$/, '')
    }

    // Получение пути для текущей страницы (pathname).
    // Без URL query и других частей.
    static getCurrentPath(): string | null {
        return this.location?.pathname ?? null
    }
}

/**
 * @deprecated
 * Use import {NavigationService} from 'swayok-react-mdb-ui-kit/services/NavigationService'
 */
export default NavigationService

/**
 * Настройка NavigationService и отслеживание текущей локации.
 */
export function useNavigationService() {
    const location: Location = useLocation()
    const navigate = useNavigate()

    // Сохранение навигатора в сервисе.
    useEffect(() => {
        NavigationService.setNavigator(navigate)
    }, [navigate])

    // Сохранение текущей локации в сервисе.
    useEffect(() => {
        NavigationService.setLocation(location)
    }, [location])
}
