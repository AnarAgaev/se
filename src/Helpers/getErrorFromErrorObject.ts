export type ErrorType = {
    [key: string]: string[]
}

// Type guard для проверки, соответствует ли объект типу ErrorType
function isErrorType(error: unknown): error is ErrorType {
    return (
        typeof error === 'object' &&
            error !== null &&
            Object.values(error).every(
                value => Array.isArray(value) && value.every(item => typeof item === 'string')
            )
    )
}

export const getErrorFromErrorObject = (error: unknown): string | undefined => {
    if (!isErrorType(error)) return

    const errorMessage = Object
        .values(error)
        .flat()
        .join(' ')

    return errorMessage
}