import React, {useState} from 'react'
import WysiwygInput from '../../components/Input/WysiwygInput'

export default function HtmlEditorsDemo() {

    const [
        text,
        setText,
    ] = useState<string>('')

    return (
        <>
            <WysiwygInput
                label={'HTML Editor'}
                value={text}
                onChange={e => {
                    setText(e.currentTarget.value)
                }}
            />
            <WysiwygInput
                label={'HTML Editor disabled'}
                value={text}
                onChange={e => {
                    setText(e.currentTarget.value)
                }}
                disabled
            />
            <WysiwygInput
                label={'HTML Editor invalid'}
                value={text}
                onChange={e => {
                    setText(e.currentTarget.value)
                }}
                invalid={true}
                validationMessage="Validation message"
            />
        </>
    )
}
