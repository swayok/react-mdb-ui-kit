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

    // Получить содержимое SVG элемента.
    static getSvgContents(
        name: string,
        children: ReactNode | ReactNode[],
        svgProps: AnyObject
    ): ReactNode | ReactNode[] {
        if (!(name in this.svgElements)) {
            this.svgElements[name] = this.rememberSvgElement(
                name,
                children,
                (svgProps.viewBox as string | undefined)
            )
        }
        if (!this.svgElements[name]) {
            return null
        }
        return (
            <svg {...svgProps}>
                <use href={'#' + this.svgElements[name]} />
            </svg>
        )
    }

    // Запомнить SVG элемент.
    private static rememberSvgElement(
        name: string,
        svgChildren: ReactNode | ReactNode[],
        viewBox?: string | null
    ): string {
        const reusableId: string = this.getSvgId(name)
        const reusableIdContainer: string = reusableId + '-container'
        const svg: SVGSVGElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        )
        svg.id = reusableIdContainer
        svg.style.display = 'none'
        this.getContainer().appendChild(svg)
        ReactDOMClient.createRoot(svg).render(
            <symbol
                id={reusableId}
                viewBox={viewBox ?? undefined}
            >
                {svgChildren}
            </symbol>
        )
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
