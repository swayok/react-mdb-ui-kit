import React from 'react'
import {Badge} from '../../components/Badge'
import {SectionDivider} from '../../components/SectionDivider'
import {BackgroundColors} from 'swayok-react-mdb-ui-kit/types/Common'

// Демонстрация компонента <Badge>.
export function BadgesDemo() {

    return (
        <div className="mt-n3">
            {colors.map(color => (
                <div key={color}>
                    <SectionDivider label={color}/>
                    <div className="d-flex flex-row align-items-center gap-4">
                        <div className="position-relative">
                            <Badge color={color}>Badge</Badge>
                        </div>
                        <div className="position-relative">
                            <Badge color={color} pill>Pill</Badge>
                        </div>
                        <div className="position-relative" style={{width: 100}}>
                            Text <Badge color={color} notification>Notification</Badge>
                        </div>
                        <div className="position-relative">
                            Dot <Badge color={color} dot/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export const colors: BackgroundColors[] = [
    'gray',
    'green',
    'red',
    'orange',
    'blue',

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
