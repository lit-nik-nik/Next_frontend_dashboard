export const myOptions = (token) => {
    const options = {
        headers: {
            'Authorization': token
        }
    }

    return options
}