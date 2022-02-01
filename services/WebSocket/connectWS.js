
export const ConnectWS = () => {
    const isBrowser = typeof window !== "undefined";

    return isBrowser ? new WebSocket("ws://192.168.2.10:3131/connect") : null

}