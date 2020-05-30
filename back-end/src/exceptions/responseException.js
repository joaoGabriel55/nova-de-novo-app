
export const Exception = (response, code, message) => {
    return response.status(code).json({
        status: 'Error',
        message: message,
    })
}
