import React from 'react'
import Button from 'swayok-react-mdb-ui-kit/components/Button'
import ToastService from 'swayok-react-mdb-ui-kit/services/ToastService'

// Демонстрация всплывающих уведомлений.
export default function ToastsDemo() {

    return (
        <div>
            <Button
                color="blue"
                onClick={() => ToastService.info(
                    'This is informational toast message.',
                    2000
                )}
            >
                Info Toast
            </Button>
            <Button
                color="green"
                className="ms-4"
                onClick={() => ToastService.success(
                    'This is success toast message.',
                    2000
                )}
            >
                Success Toast
            </Button>
            <Button
                color="red"
                className="ms-4"
                onClick={() => ToastService.error(
                    'This is error toast message.',
                    2000
                )}
            >
                Error Toast
            </Button>
        </div>
    )
}
