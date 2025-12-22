import {mdiPencilBoxOutline} from '@mdi/js'
import {Button} from '../../components/Button/Button'
import {Icon} from '../../components/Icon/Icon'
import {SectionDivider} from '../../components/Typography/SectionDivider'
import {ButtonColors} from '../../types'

export function ButtonsDemo() {

    return (
        <>
            <div className="d-grid grid-columns-2 grid-columns-gap-3 grid-rows-gap-3">
                <div>
                    <div className="mb-3">
                        <Button>
                            Button default
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button small>
                            Button default small
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button large>
                            Button default large
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button disabled>
                            Button default disabled
                        </Button>
                    </div>
                </div>
                <div>
                    <div className="mb-3">
                        <Button outline>
                            Button outline
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button
                            small
                            outline
                        >
                            Button outline small
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button
                            large
                            outline
                        >
                            Button outline large
                        </Button>
                    </div>
                    <div className="mb-3">
                        <Button
                            disabled
                            outline
                        >
                            Button outline disabled
                        </Button>
                    </div>
                </div>
            </div>
            {buttonColors.map(color => (
                <div key={color}>
                    <SectionDivider label={'Color: ' + color} />
                    <div className="d-grid grid-columns-2 grid-columns-gap-3 grid-rows-gap-3 mb-3">
                        <div>
                            <Button color={color}>
                                Solid: {color}
                            </Button>
                        </div>
                        <div>
                            <Button
                                color={color}
                                disabled
                            >
                                Disabled: {color}
                            </Button>
                        </div>
                        <div>
                            <Button
                                color={color}
                                hasIcon
                            >
                                <Icon path={mdiPencilBoxOutline} /> Solid: {color}
                            </Button>
                        </div>
                        <div>
                            <Button
                                color={color}
                                hasIcon
                                disabled
                            >
                                <Icon path={mdiPencilBoxOutline} /> Disabled: {color}
                            </Button>
                        </div>
                        <div>
                            <Button
                                color={color}
                                outline
                            >
                                Outline: {color}
                            </Button>
                        </div>
                        <div>
                            <Button
                                color={color}
                                outline
                                disabled
                            >
                                Disabled: {color}
                            </Button>
                        </div>
                        <div>
                            <Button
                                color={color}
                                outline
                                hasIcon
                            >
                                <Icon path={mdiPencilBoxOutline} /> Outline: {color}
                            </Button>
                        </div>
                        <div>
                            <Button
                                color={color}
                                outline
                                disabled
                                hasIcon
                            >
                                <Icon path={mdiPencilBoxOutline} /> Disabled: {color}
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <SectionDivider label="Buttons Group" />
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button color="green">
                        Button 1
                    </Button>
                    <Button color="blue">
                        Button 2
                    </Button>
                    <Button color="gray">
                        Button 3
                    </Button>
                </div>
            </div>
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        small
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        small
                    >
                        Button 2
                    </Button>
                    <Button
                        color="gray"
                        small
                    >
                        Button 3
                    </Button>
                </div>
            </div>
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        large
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        large
                    >
                        Button 2
                    </Button>
                    <Button
                        color="gray"
                        large
                    >
                        Button 3
                    </Button>
                </div>
            </div>

            <SectionDivider label="Outline Buttons Group" />
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        outline
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        outline
                    >
                        Button 2
                    </Button>
                    <Button
                        color="red"
                        outline
                    >
                        Button 3
                    </Button>
                </div>
            </div>
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        small
                        outline
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        small
                        outline
                    >
                        Button 2
                    </Button>
                    <Button
                        color="red"
                        small
                        outline
                    >
                        Button 3
                    </Button>
                </div>
            </div>
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        large
                        outline
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        large
                        outline
                    >
                        Button 2
                    </Button>
                    <Button
                        color="red"
                        large
                        outline
                    >
                        Button 3
                    </Button>
                </div>
            </div>

            <SectionDivider label="Mixed Buttons Group" />
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        outline
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        outline
                    >
                        Button 2
                    </Button>
                    <Button color="gray">
                        Button 3
                    </Button>
                </div>
            </div>
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        small
                        outline
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        small
                    >
                        Button 2
                    </Button>
                    <Button
                        color="red"
                        small
                        outline
                    >
                        Button 3
                    </Button>
                </div>
            </div>
            <div className="mb-3">
                <div className="btn-group ms-2">
                    <Button
                        color="green"
                        large
                    >
                        Button 1
                    </Button>
                    <Button
                        color="blue"
                        large
                        outline
                    >
                        Button 2
                    </Button>
                    <Button
                        color="red"
                        large
                        outline
                    >
                        Button 3
                    </Button>
                </div>
            </div>
        </>
    )
}

export const buttonColors: ButtonColors[] = [
    'gray',
    'green',
    'red',
    'orange',
    'blue',
    'link',

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
]
