export const getTokenCookies = (str) => {
    let startToken, endToken, newStr

    if (str) {
        startToken = str.indexOf('token=') + 6
        endToken = str.indexOf('; userId')

        newStr = str.slice(startToken, endToken)
    }

    return newStr
}