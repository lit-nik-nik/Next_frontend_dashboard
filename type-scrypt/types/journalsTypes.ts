export type Chat = {
    viewComments: {
        view: boolean,
        orderId: number,
        orderName: string,
    },
    token: string,
    getComments: any,
    setError: any,
    closeChat: any,
    comments: [],
    user: {
        userName: string,
        isOwner: boolean
    }
}

export type ExtraData = {
    id?: number;
    journalId?: number;
    sectorId?: number;
    orderId?: number;
    employeeId?: number;
    group?: string;
    name?: string;
    data?: string;
    type?: string;
    userName?: string;
    sector?: string;
    ts?: any;
    list?: string [];
}