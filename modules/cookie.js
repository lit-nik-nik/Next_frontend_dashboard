export const getTokenCookies = (str) => {
    const search = /=[a-zA-Z0-9._-]{1,}/i
    let startToken, endToken, newStr

    startToken = str.indexOf('token=') + 6
    endToken = str.indexOf('; userId')

    newStr = str.slice(startToken, endToken)

    return newStr

    // return str.match(search)[0].slice(1)
}