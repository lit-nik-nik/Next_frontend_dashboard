const hex = {
    '0':9, '1':8, '2':7, '3':6, '4':5, '5':4, '6':3, '7':2, '8':1, '9':0,
    'A':10, 'B':11, 'C':12, 'D':13, 'E':14, 'F':15, 'G':16, 'H':17, 'I':18, 'J':19,
    'K':20, 'L':21, 'M':22, 'N':23, 'O':24, 'P':25, 'Q':26, 'R':27, 'S':28, 'T':29,
    'U':30, 'V':31, 'W':32, 'X':33, 'Y':34, 'Z':35, 'a':36, 'b':37, 'c':38, 'd':39,
    'e':40, 'f':41, 'g':42, 'h':43, 'i':44, 'j':45, 'k':46, 'l':47, 'm':48, 'n':49,
    'o':50, 'p':51, 'q':52, 'r':53, 's':54, 't':55, 'u':56, 'v':57, 'w':58, 'x':59,
    'y':60, 'z':61
}

export function encritptedStr(string) {
    let arr = []

    for (let i = 0; i < string.length; i++) {
        for (let key in hex) {
            if (string[i] === key) {
                arr = [...arr, hex[key]]
            }
        }
    }

    return JSON.stringify(arr)
}

export function decriptedStr(arr) {
    let arrStr = [], string

    JSON.parse(arr).map((item, i) => {
        for (let key in hex) {
            if (item === hex[key]) {
                arrStr = [...arrStr, key]
            }
        }
    })

    string = arrStr.join('')

    return string
}