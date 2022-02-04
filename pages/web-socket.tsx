import MainLayout from "../components/layout/main";
import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {ConnectWS} from "../api/WebSocket/connectWS";

const WebSocketPage:React.FC<{token: string}> = ({token}) => {

    const [title, setTitle] = useState('Тест WebSocket')
    const [wsInstance, setWsInstance] = useState(null)
    const [wsState, setWsState] = useState(3)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)

    // Call when updating the ws connection
    const updateWs = useCallback(() => {
        // Close the old connection
        if(wsInstance?.readyState !== 3) {
            wsInstance.close(1000)
        }

        // Create a new connection
        const newWs = ConnectWS()
        setWsInstance(newWs);
    }, [wsInstance])

    useEffect(() => {
        const ws = ConnectWS()
        setWsInstance(ws)

        ws.onmessage = (e) => {
            const hours = Math.trunc(e.data/360000),
                minutes = Math.trunc(e.data/6000) - hours*60,
                seconds = Math.trunc(e.data/100) - minutes*60 - hours*60

            setSeconds(seconds)
            setMinutes(minutes)
            setHours(hours)
        }

        return () => {
            if (ws?.readyState !== 3) {
                ws.close(1000)
                console.log(`[close] Соединение закрыто чисто, код: 1000 причина: Ушел со страницы`)
            }
        }
    }, [])

    useEffect(() => setWsState(wsInstance?.readyState), [wsInstance?.readyState])

    const color = () => {
        switch (wsState) {
            case 0:
                return 'green'
            case 1:
                return 'blue'
            case 2:
                return 'orange'
            case 3:
                return 'red'
            default:
                return 'red'
        }
    }

    const text = () => {
        switch (wsState) {
            case 0:
                return 'WS - Соединено'
            case 1:
                return 'WS - Передача данных'
            case 2:
                return 'WS - Соединение закрывается'
            case 3:
                return 'WS - Соединение разорвано'
            default:
                return 'WS - Соединение разорвано'
        }
    }

    return (
        <MainLayout title={title} link={'/constructor'} token={token}>
            <Row className='my-3 text-center'>
                <Col lg={12}>
                    <h1 className='text-center mt-2'>{title}</h1>
                    <hr/>
                </Col>

                <Col lg={4}>
                    <div
                        className='mx-auto'
                        style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: `${color()}`
                        }}
                    />
                    {text()}
                </Col>
                <Col lg={4}>
                    WebSocket Timer: {`${hours}`.length < 2 ? `0${hours}` : hours} : {`${minutes}`.length < 2 ? `0${minutes}` : minutes} : {`${seconds}`.length < 2 ? `0${seconds}` : seconds}
                </Col>
                <Col lg={4}>
                    <Button
                        variant='danger'
                        onClick={() => {
                            wsInstance.close(1000)
                            setWsState(wsInstance?.readyState)
                            setTimeout(() => setWsState(wsInstance?.readyState), 1000)
                        }}
                    >
                        Закрыть соединение WS
                    </Button>
                </Col>
            </Row>

        </MainLayout>
    )
}

export default WebSocketPage;