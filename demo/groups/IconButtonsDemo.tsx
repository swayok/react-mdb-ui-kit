import {
    mdiCloseBoxOutline,
    mdiPencilBoxOutline,
    mdiPlusBoxOutline,
} from '@mdi/js'
import {IconButton} from '../../components/Icon/IconButton'
import {buttonColors} from './ButtonsDemo'

export function IconButtonsDemo() {

    return (
        <div className="d-grid grid-columns-2 grid-columns-gap-3">
            {colors.map((color, index) => (
                <div
                    key={index}
                    className="d-flex flex-row"
                >
                    <div className="">
                        <IconButton
                            path={mdiPencilBoxOutline}
                            color={color}
                            onClick={() => {

                            }}
                        />
                    </div>
                    <div className="ms-1">
                        <IconButton
                            tooltip={'Color ' + color}
                            path={mdiCloseBoxOutline}
                            color={color}
                            onClick={() => {

                            }}
                        />
                    </div>
                    <div className="ms-1">
                        <IconButton
                            label={'Color ' + color}
                            path={mdiPlusBoxOutline}
                            color={color}
                            onClick={() => {

                            }}
                        />
                    </div>
                    <div className="ms-1">Text</div>
                </div>
            ))}
        </div>
    )
}

const colors = buttonColors.filter(color => !['link', 'icon'].includes(color))
