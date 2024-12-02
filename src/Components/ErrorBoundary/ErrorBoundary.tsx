import React from 'react'
import style from './ErrorBoundary.module.sass'

interface Props {
    children: React.ReactNode
}

interface ErrorState {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

const { container, title, subtitle, picture } = style

class ErrorBoundary extends React.Component<Props, ErrorState> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ hasError: true, error, errorInfo })
    }

    render() {
        const { hasError, error, errorInfo } = this.state

        if (hasError) {
            console.error(error?.toString())
            console.error(errorInfo?.componentStack)

            return (
                <div className={container}>
                    <h1 className={title}>Что-то пошло не так!</h1>
                    <p className={subtitle}>Попробуйте перезагрузить страницу или зайти на сайт позже.</p>
                    <img className={picture} src="https://aws.massive.ru/sew/img/error.webp" alt="Что-то пошло не так."/>
                </div>
            );
        }

        return this.props.children
    }
}

export default ErrorBoundary
