import {
    mdiAccount,
    mdiSquareEditOutline,
} from '@mdi/js'
import {SectionDivider} from 'swayok-react-mdb-ui-kit/components/Typography/SectionDivider'
import {Icon} from '../../components/Icon/Icon'
import {IconButton} from '../../components/Icon/IconButton'
import {IconHref} from '../../components/Icon/IconHref'
import {linkColors} from './LinksDemo'

export function IconsDemo() {

    return (
        <>
            <SectionDivider
                label="Icon colors"
                margins="none"
                className="mb-3"
            />
            <div className="d-grid grid-columns-3 grid-columns-gap-3 grid-rows-gap-2">
                {iconColors.map(color => (
                    <div key={color}>
                        <Icon
                            path={mdiSquareEditOutline}
                            color={color}
                            label={`Color: ${color}`}
                        />
                    </div>
                ))}
            </div>

            <SectionDivider label="Reusable icons (inline implementation)" />
            <svg
                id="reusable-svg-icon-mdiAccount-container"
                style={{display: 'none'}}
            >
                <symbol
                    id="reusable-svg-icon-inline-demo"
                    viewBox="0 0 24 24"
                >
                    <path
                        d={mdiAccount}
                        fill="currentColor"
                    />
                </symbol>
            </svg>
            <div className="d-grid grid-columns-3 grid-columns-gap-3 grid-rows-gap-1">
                <div className="with-icon-flex gap-2">
                    <svg
                        viewBox="0 0 24 24"
                        style={{width: '24px', height: '24px'}}
                        className="mdi-icon text-primary"
                    >
                        <path d={mdiAccount} />
                    </svg>
                    <span>
                        Example (primary)
                    </span>
                </div>
                <div className="with-icon-flex gap-2">
                    <svg
                        viewBox="0 0 24 24"
                        style={{width: '24px', height: '24px'}}
                        className="mdi-icon text-primary"
                    >
                        <use href="#reusable-svg-icon-inline-demo" />
                    </svg>
                    <span>
                        Reuse (primary)
                    </span>
                </div>
                <div className="with-icon-flex gap-2">
                    <svg
                        viewBox="0 0 24 24"
                        style={{width: '24px', height: '24px'}}
                        className="mdi-icon text-blue"
                    >
                        <use href="#reusable-svg-icon-inline-demo" />
                    </svg>
                    <span>
                        Reuse (blue)
                    </span>
                </div>
            </div>

            <SectionDivider label="Reusable icons in links (inline implementation)" />
            <div className="d-grid grid-columns-3 grid-columns-gap-3 grid-rows-gap-1">
                <a
                    href="#"
                    className="with-icon-flex gap-2 link-primary"
                >
                    <svg
                        viewBox="0 0 24 24"
                        style={{width: '24px', height: '24px'}}
                        className="mdi-icon"
                    >
                        <path d={mdiAccount} />
                    </svg>
                    <span>
                        Example (primary)
                    </span>
                </a>
                <a
                    href="#"
                    className="with-icon-flex gap-2 link-primary"
                >
                    <svg
                        viewBox="0 0 24 24"
                        style={{width: '24px', height: '24px'}}
                        className="mdi-icon"
                    >
                        <use href="#reusable-svg-icon-inline-demo" />
                    </svg>
                    <span>
                        Reuse (primary)
                    </span>
                </a>
                <a
                    href="#"
                    className="with-icon-flex gap-2 link-blue"
                >
                    <svg
                        viewBox="0 0 24 24"
                        style={{width: '24px', height: '24px'}}
                        className="mdi-icon"
                    >
                        <use href="#reusable-svg-icon-inline-demo" />
                    </svg>
                    <span>
                        Reuse (blue)
                    </span>
                </a>
            </div>

            <SectionDivider label="Reusable icons (<Icon reuse='mdiAccount'>)" />
            <div className="d-grid grid-columns-3 grid-columns-gap-3 grid-rows-gap-2">
                <Icon
                    path={mdiAccount}
                    color="primary"
                    label="Example (primary)"
                />
                <Icon
                    path={mdiAccount}
                    color="primary"
                    label="First (primary)"
                    reuse="mdiAccount"
                />
                <Icon
                    path={mdiAccount}
                    color="primary"
                    label="Reuse 1 (primary)"
                    reuse="mdiAccount"
                />
                <Icon
                    path={mdiAccount}
                    color="blue"
                    label="Reuse 2 (blue)"
                    reuse="mdiAccount"
                />
            </div>

            <SectionDivider label="Reusable icons (<IconHref reuse='mdiAccount-href'>)" />
            <div className="d-grid grid-columns-3 grid-columns-gap-3 grid-rows-gap-2">
                <IconHref
                    path={mdiAccount}
                    color="primary"
                    href="#"
                >
                    Example (primary)
                </IconHref>
                <IconHref
                    path={mdiAccount}
                    color="primary"
                    href="#"
                    reuse="mdiAccount-href"
                >
                    First (primary)
                </IconHref>
                <IconHref
                    path={mdiAccount}
                    color="primary"
                    href="#"
                    reuse="mdiAccount-href"
                >
                    Reuse 1 (primary)
                </IconHref>
                <IconHref
                    path={mdiAccount}
                    color="blue"
                    href="#"
                    reuse="mdiAccount-href"
                >
                    Reuse 2 (blue)
                </IconHref>
                <IconHref
                    path={mdiAccount}
                    color="green"
                    href="#"
                    reuse="mdiAccount"
                >
                    Reuse from {'<Icon/>'}
                </IconHref>
            </div>

            <SectionDivider label="Reusable icons (<IconButton reuse='mdiAccount-btn'>)" />
            <div className="d-grid grid-columns-3 grid-columns-gap-3 grid-rows-gap-2">
                <IconButton
                    path={mdiAccount}
                    color="primary"
                    label="Example (primary)"
                />
                <IconButton
                    path={mdiAccount}
                    color="primary"
                    reuse="mdiAccount-btn"
                    label="First (primary)"
                />
                <IconButton
                    path={mdiAccount}
                    color="primary"
                    href="#"
                    reuse="mdiAccount-btn"
                    label="Reuse 1 (primary)"
                />
                <IconButton
                    path={mdiAccount}
                    color="blue"
                    reuse="mdiAccount-btn"
                    label="Reuse 2 (blue)"
                />
                <IconButton
                    path={mdiAccount}
                    color="green"
                    reuse="mdiAccount"
                    label="Reuse from <Icon/>"
                />
            </div>
        </>
    )
}

const iconColors = linkColors
