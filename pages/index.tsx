import {Col, Row,} from "react-bootstrap"
import MainLayout from '../components/layout/main'
import {useRouter} from "next/router";
import React, {useCallback, useEffect, useState} from "react";
import {connect} from 'react-redux';
import {setLoading, removeLoading} from "../redux/actions/actionsApp";
import {ConnectWS} from "../services/WebSocket/test"
import {millisecondsToHours, millisecondsToMinutes, millisecondsToSeconds} from "date-fns";

const Home:React.FC<{token: string}> = ({token}) => {
    const router = useRouter()

    const [wsInstance, setWsInstance] = useState(null)
    const [link, setLink] = useState(router.pathname)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)

    // Call when updating the ws connection
    const updateWs = useCallback(() => {
        // Close the old connection
        if(wsInstance?.readyState !== 3)
            wsInstance.close(1000)

        // Create a new connectio
        const newWs = ConnectWS()
        setWsInstance(newWs);
    }, [wsInstance])

    useEffect(() => {
        const ws = ConnectWS()

        ws.onmessage = (e) => {
            const hours = millisecondsToHours(e.data),
                minutes = millisecondsToMinutes(e.data) - hours*60,
                seconds = millisecondsToSeconds(e.data) - minutes*60 - hours*60

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

    return (
        <MainLayout title='Панель управления' link={link} token={token}>
            <Row className='my-3 text-center'>
                <Col lg={12}>
                    <h2>Панель управления</h2>
                    <hr/>
                </Col>

                <Col lg={4}>
                </Col>
                <Col lg={4}>
                    WebSocket Timer: {hours} ч. {minutes} мин. {seconds} сек.
                </Col>
                <Col lg={4}>
                </Col>
            </Row>
        </MainLayout>
    )
}

export default Home;