export const getTokenCookies = (str) => {
    const search = /=[a-zA-Z0-9._-]{1,}/i

    return str.match(search)[0].slice(1)
}