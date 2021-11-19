export const getTokenCookies = (str) => {
    let startToken, endToken, newStr

    if (str) {
        startToken = str.indexOf('token=') + 6
        endToken = str.indexOf('; userId') === -1 ? str.length : str.indexOf('; userId')

        newStr = str.slice(startToken, endToken)

        // newStr = str.substr(startToken, 144)
    }

    return newStr
}