import * as React from 'react'
import {ReactNode} from 'react'
import {AnyObject} from 'swayok-react-mdb-ui-kit/types/Common'

export interface ReusableSvgRepositoryConfig {
    containerClassName?: string
}

export type ReusableSvgRepositorySetSvgElementFn = (element: SVGSVGElement | null) => void

type ReusableSvgRepositoryRememberFallbackFn = (resolve: ReusableSvgRepositorySetSvgElementFn) => ReactNode | ReactNode[]

interface CachedSvgElement {
    uid: string | number
    children: ReactNode | ReactNode[]
}

export class ReusableSvgRepository {

    private static container: HTMLDivElement | null = null

    private static svgElements: AnyObject<CachedSvgElement, string> = {}

    private static config: ReusableSvgRepositoryConfig = {}

    static configure(config: ReusableSvgRepositoryConfig) {
        this.config = {...this.config, ...config}
        if (this.container) {
            this.container.className = this.config.containerClassName ?? ''
        }
    }

    static getSvgContents(
        name: string,
        uid: string | number,
        fallback: ReusableSvgRepositoryRememberFallbackFn,
        reusableItemContainerClass?: string,
    ): ReactNode | ReactNode[] {
        const reusableId = this.getSvgId(name)
        if (name in this.svgElements) {
            return this.svgElements[name]!.uid === uid
                ? this.svgElements[name]!.children
                : <use href={'#' + reusableId} />
        }
        // Запоминаем сразу uid, чтобы в дальнейшем для этого uid отдавать результат.
        this.svgElements[name] = {
            uid,
            children: fallback(
                element => this.rememberSvgElement(
                    name,
                    element,
                    reusableItemContainerClass
                )
            )
        }
        return this.svgElements[name].children
    }

    private static rememberSvgElement(
        name: string,
        svgElement: SVGSVGElement | null,
        reusableItemContainerClass?: string,
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
        if (reusableItemContainerClass) {
            iconContainer.className = reusableItemContainerClass
        }
        // Клонируем иконку и добавляем ее в невидимый контейнер.
        const clone: SVGSVGElement = svgElement.cloneNode(true) as SVGSVGElement
        clone.id = reusableId
        iconContainer.append(clone)
        this.getContainer().appendChild(iconContainer)
    }

    private static getContainer(): Node {
        if (!this.container) {
            this.container = document.createElement('div')
            this.container.style.display = 'none'
            document.body.appendChild(this.container)
        }
        return this.container
    }

    private static getSvgId(name: string): string {
        return 'reusable-svg-' + name
    }


}
