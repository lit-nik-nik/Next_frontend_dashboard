
export const ConnectWS = () => {

    const isBrowser = typeof window !== "undefined";

    const wsInstance = isBrowser ? new WebSocket("ws://192.168.2.10:3131/connect") : null;

    return wsInstance

    // ws.onopen = function(e) {
    //     console.log("[open] Соединение установлено");
    // };
    //
    // ws.onmessage = function(event) {
    //     // console.log(`[message] Данные получены с сервера: ${event.data}`);
    //     console.log(event);
    // };

    // ws.onclose = function(event) {
    //     if (event.wasClean) {
    //         alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    //     } else {
    //         // например, сервер убил процесс или сеть недоступна
    //         // обычно в этом случае event.code 1006
    //         alert('[close] Соединение прервано');
    //     }
    // };
    //
    // ws.onerror = function(error) {
    //     alert(`[error] ${error.message}`);
    // };
}