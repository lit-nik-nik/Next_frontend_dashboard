export type Action = (payload?: string | number | [] | {} | boolean) => {
    type: string,
    payload?: string | number | [] | {} | boolean
}

export type PropsType = {
    token: string,
}