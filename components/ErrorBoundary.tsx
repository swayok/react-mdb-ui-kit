import React from 'react'

type Props = {
    children: React.ReactNode | React.ReactNode[],
    silent?: boolean,
};

type State = {
    hasError: boolean
};

// Ограничитель глубины отрабатывания ошибок в JS/JSX.
// Если ошибка произошла внутри этого компонента, то отображается страница с ошибкой.
// Ошибка так же не будет влиять на всё приложение (т.е. интерфейс вне компонента продолжит работать вместо полного отказа).
export default class ErrorBoundary extends React.Component<Props, State> {

    state: State = {
        hasError: false,
    }

    static getDerivedStateFromError() {
        return {hasError: true}
    }

    componentDidCatch(error: Error) {
        console.error('[ErrorBoundary] Error catched: ', error)
        // todo: Раскомментировать если будем использовать Sentry
        // componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // if (AppConfig.isProduction) {
        //     Sentry.captureException(error, {
        //         extra: {
        //             componentStack: errorInfo.componentStack,
        //         },
        //     })
        // }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.silent) {
                return null
            }
            return (
                <div className="text-danger">
                    Error happened while rendering component. See details in console.
                </div>
            )
        }

        return this.props.children
    }
}
