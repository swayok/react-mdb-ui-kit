import {ReactNode} from 'react'
import {AnyObject} from '../types'

export interface ReusableSvgRepositoryConfig {
    containerClassName?: string
}

export type ReusableSvgRepositorySetSvgElementFn = (
    element: SVGSVGElement | null
) => void

type ReusableSvgRepositoryRememberFallbackFn = (
    resolve: ReusableSvgRepositorySetSvgElementFn
) => ReactNode | ReactNode[]

interface CachedSvgElement {
    uid: string | number
    children: ReactNode | ReactNode[]
}

// Репозиторий для кеширования SVG элементов.
export abstract class ReusableSvgRepository {

    // Контейнер для кешированных SVG элементов.
    private static container: HTMLDivElement | null = null

    // Кешированные SVG элементы.
    private static svgElements: AnyObject<CachedSvgElement, string> = {}

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
        uid: string | number,
        fallback: ReusableSvgRepositoryRememberFallbackFn,
        reusableItemContainerClassName?: string
    ): ReactNode | ReactNode[] {
        const reusableId = this.getSvgId(name)
        if (name in this.svgElements) {
            return this.svgElements[name].uid === uid
                ? this.svgElements[name].children
                : <use href={'#' + reusableId} />
        }
        // Запоминаем сразу uid, чтобы в дальнейшем для этого uid отдавать результат.
        this.svgElements[name] = {
            uid,
            children: fallback(
                element => this.rememberSvgElement(
                    name,
                    element,
                    reusableItemContainerClassName
                )
            ),
        }
        return this.svgElements[name].children
    }

    // Запомнить SVG элемент.
    private static rememberSvgElement(
        name: string,
        svgElement: SVGSVGElement | null,
        reusableItemContainerClassName?: string
    ): void {
        if (!svgElement) {
            return
        }
        const reusableId: string = this.getSvgId(name)
        const existing: HTMLElement | null = document.getElementById(reusableId)
        if (existing) {
            existing.parentElement?.remove()
        }
        // Создаем контейнер для хранения оригинала иконки.
        const iconContainer: HTMLDivElement = document.createElement('div')
        iconContainer.style.display = 'none'
        if (reusableItemContainerClassName) {
            iconContainer.className = reusableItemContainerClassName
        }
        // Клонируем иконку и добавляем ее в невидимый контейнер.
        const clone: SVGSVGElement = svgElement.cloneNode(true) as SVGSVGElement
        clone.id = reusableId
        iconContainer.append(clone)
        this.getContainer().appendChild(iconContainer)
    }

    // Получить контейнер кешированных SVG элементов.
    private static getContainer(): Node {
        if (!this.container) {
            this.container = document.createElement('div')
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
