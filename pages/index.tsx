import {Button, Col, Row} from "react-bootstrap"
import MainLayout from '../components/layout/main'
import {useRouter} from "next/router";
import React, {useCallback, useEffect, useState} from "react";
import {connect} from 'react-redux';
import {setLoading, removeLoading} from "../redux/actions/actionsApp";
import {ConnectWS} from "../api/WebSocket/connectWS"

const HomePage:React.FC<{token: string}> = ({token}) => {
    const router = useRouter()



    return (
        <MainLayout title='Панель управления' link={router.pathname} token={token}>
            <Row className='my-3 text-center'>
                <Col lg={12}>
                    <h2>Панель управления</h2>
                    <hr/>
                </Col>
            </Row>
        </MainLayout>
    )
}

export default HomePage;