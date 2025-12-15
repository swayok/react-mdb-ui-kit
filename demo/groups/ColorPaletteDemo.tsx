import clsx from 'clsx'

interface Props {
    color: string
    variants?: string[]
    accents?: string[]
}

const defaultVariants: string[] = [
    '50',
    '100',
    '200',
    '300',
    '350',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
]

const defaultAccents: string[] = [
    'accent-100',
    'accent-200',
    'accent-400',
    'accent-700',
]

export function ColorPaletteDemo(props: Props) {

    const {
        color,
        variants = defaultVariants,
        accents = defaultAccents,
    } = props
    return (
        <div className={clsx('color-palette-demo', color)}>
            {variants.concat(accents).map(suffix => (
                <div
                    key={suffix}
                    className={clsx('color-variant', 'color-variant-' + suffix)}
                >
                    <div className={clsx('color-suffix', suffix === '500' ? 'fw-800' : null)}>
                        {suffix}
                    </div>
                    <div className="color-in-bg" />
                    <div className="color-in-text" />
                    <div className="color-in-text light-bg" />
                    <div className="color-in-text gray-bg" />
                    <div className="color-in-text dark-bg" />
                    <div className="color-in-text black-bg" />
                    <div className="color-variable" />
                </div>
            ))}
        </div>
    )
}
