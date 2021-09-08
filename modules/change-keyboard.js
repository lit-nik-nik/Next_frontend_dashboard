export const changeKeyboard = (value) => {
    const keyboard = {
        q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ', p: 'з', a: 'ф', s: 'ы', d: 'в', f: 'а',
        g: 'п', h: 'р', j: 'о', k: 'л', l: 'д', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и', n: 'т', m: 'ь',
        Q: 'Й', W: 'Ц', E: 'У', R: 'К', T: 'Е', Y: 'Н', U: 'Г', I: 'Ш', O: 'Щ', P: 'З', A: 'Ф', S: 'Ы', D: 'В', F: 'А',
        G: 'П', H: 'Р', J: 'О', K: 'Л', L: 'Д', Z: 'Я', X: 'Ч', C: 'С', V: 'М', B: 'И', N: 'Т', M: 'Ь'
    }
    let array = []

    for (let i = 0; i < value.length; i++) {
        if (/[0-9]/g.test(+value[i])) array.push(value[i])
        else if(/[a-zA-Z]/g.test(value[i])) array.push(value[i].toUpperCase())
        else {
            for (let key in keyboard) {
                if (value[i] === keyboard[key]) array.push(key.toUpperCase())
            }
        }
    }

    return array.join('')
}