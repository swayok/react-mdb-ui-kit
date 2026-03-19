import {ReactNode} from 'react'
import * as ReactDOMClient from 'react-dom/client'
import {AnyObject} from '../types'

export interface ReusableSvgRepositoryConfig {
    containerClassName?: string
}

export type ReusableSvgRepositorySetSvgElementFn = (
    element: SVGSVGElement | null
) => void

// Репозиторий для кеширования SVG элементов.
export abstract class ReusableSvgRepository {

    // ID контейнера для кешированных SVG элементов.
    private static containerId: string = '__reusable-svg-container'

    // Контейнер для кешированных SVG элементов.
    private static container: HTMLDivElement | null = null

    // Кешированные SVG элементы (ID SVG элемента).
    private static svgElements: AnyObject<string | null> = {}

    // Настройки репозитория.
    private static config: ReusableSvgRepositoryConfig = {}

    // Настроить репозиторий.
    static configure(config: ReusableSvgRepositoryConfig) {
        this.config = {...this.config, ...config}
        if (this.container) {
            this.container.className = this.config.containerClassName ?? ''
        }
    }

    // Получить ID кешированного SVG элемента.
    static getCachedSvgElementId(name: string): string | null {
        return this.svgElements[name] ?? null
    }

    // Запомнить SVG элемент.
    // Внимание! Вызывать только из useMemo(() => rememberSvgElement(...), [name])!!
    static rememberSvgElement(
        name: string,
        svgChildren: ReactNode | ReactNode[],
        viewBox?: string | null
    ): string {
        const reusableId: string = this.getSvgId(name)
        if (name in this.svgElements) {
            return reusableId
        }
        this.svgElements[name] = reusableId
        const reusableIdContainer: string = reusableId + '-container'
        const svg: SVGSVGElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        )
        svg.id = reusableIdContainer
        svg.style.display = 'none'
        this.getContainer().appendChild(svg)
        // Тайм-аут тут нужен, чтобы React не ругался на render внутри setTimeout.
        setTimeout(() => {
            ReactDOMClient.createRoot(svg).render(
                <symbol
                    id={reusableId}
                    viewBox={viewBox ?? undefined}
                >
                    {svgChildren}
                </symbol>
            )
        }, 0)
        return reusableId
    }

    // Получить контейнер кешированных SVG элементов.
    private static getContainer(): Node {
        if (!this.container) {
            this.container = document.createElement('div')
            this.container.id = this.containerId
            this.container.style.display = 'none'
            document.body.appendChild(this.container)
        }
        return this.container
    }

    // Получить ID кешируемого SVG элемента.
    private static getSvgId(name: string): string {
        return 'reusable-svg-' + name
    }
}
