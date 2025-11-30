import {mdiPencilBoxOutline} from '@mdi/js'
import React from 'react'
import {Icon} from '../../components/Icon'
import {SectionDivider} from '../../components/SectionDivider'

export function LinksDemo() {
    return (
        <>
            <div>
                <a
                    href="#"
                >
                    Default Link
                </a>
            </div>
            <div>
                <a
                    href="#"
                    className="disabled"
                >
                    Disabled Link
                </a>
            </div>
            <SectionDivider label="Link Colors"/>
            <div className="d-grid grid-columns-2 grid-columns-gap-2">
                {linkColors.map((color, index) => (
                    <div key={index}>
                        .link-{color}: <a href="#" className={'link-' + color}>Link {color}</a>
                    </div>
                ))}
            </div>
            <SectionDivider label="With With Icon (.with-icon)"/>
            <div>
                <a
                    href="#"
                    className="with-icon"
                >
                    <Icon path={mdiPencilBoxOutline}/> Default Link
                </a>
            </div>
            <div>
                <a
                    href="#"
                    className="with-icon disabled"
                >
                    <Icon path={mdiPencilBoxOutline}/> Disabled Link
                </a>
            </div>
            <SectionDivider label="Link With Icon Colors (.with-icon)"/>
            <div className="d-grid grid-columns-2 grid-columns-gap-2">
                {linkColors.map((color, index) => (
                    <div key={index}>
                        .link-{color}: <a href="#" className={'with-icon link-' + color}><Icon path={mdiPencilBoxOutline}/> Link {color}</a>
                    </div>
                ))}
            </div>
            <SectionDivider label="Clickable (.clickable)"/>
            <div>
                <div className="clickable">
                    Default clickable div
                </div>
            </div>
            <div>
                <div className="clickable disabled">
                    Disabled clickable div
                </div>
            </div>
            <SectionDivider label="Clickable Colors"/>
            <div className="d-grid grid-columns-2 grid-columns-gap-3">
                {linkColors.map((color, index) => (
                    <div
                        key={index}
                        className="text-nowrap"
                    >
                        <span className="me-2">
                            .link-{color}:
                        </span>
                        <span>
                            <div className={'clickable link-' + color}>
                                Clickable {color}
                            </div>
                        </span>
                    </div>
                ))}
            </div>
            <SectionDivider label="Clickable With Icon (.clickable.with-icon)"/>
            <div>
                <div className="clickable with-icon">
                    <Icon path={mdiPencilBoxOutline}/> Default clickable div
                </div>
            </div>
            <div>
                <div className="clickable with-icon disabled">
                    <Icon path={mdiPencilBoxOutline}/> Disabled clickable div
                </div>
            </div>
            <SectionDivider label="Clickable Colors (.with-icon)"/>
            <div className="d-grid grid-columns-2 grid-columns-gap-3">
                {linkColors.map((color, index) => (
                    <div
                        key={index}
                        className="text-nowrap"
                    >
                        <span className="me-2">
                            .link-{color}:
                        </span>
                        <span>
                            <div className={'clickable with-icon link-' + color}>
                                <Icon path={mdiPencilBoxOutline}/> Clickable {color}
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        </>
    )
}

const linkColors = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark',
    'white',
    'black',
    'blue',
    'indigo',
    'purple',
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'cyan',
    'white',
    'gray',
    'gray-dark',
]
