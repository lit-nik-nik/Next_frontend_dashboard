export type Comment = {
    id: number,
    journalId: number,
    sectorId: number,
    orderId: number,
    employeeId: number,
    type: string,
    group: string,
    name: string,
    data: string,
    userName: string,
    sector: string
}

export type Chat = {
    viewComments: {
        view: boolean,
        orderId: number,
        orderName: string,
    },
    token: string,
    getComments: any,
    closeChat: any,
    comments: [],
    user: {
        userName: string,
        isOwner: boolean
    }
}