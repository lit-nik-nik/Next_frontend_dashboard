import React from "react";
import Link from "next/link";
import Router from "next/router";
import {Row, Col} from "react-bootstrap";

const Custom404:React.FC = () => {
    const redirect:Function = () => {
        typeof window !== 'undefined' && Router.push('/')
    }

    setTimeout(redirect, 3000)

    return (
        <>
            <Row style={{height: '100vh', width: '100%'}} className='bg-image-404'>
                <Col />
                <Col lg={4} className='shadow-lg rounded-3 bg-white' style={{marginTop: '35vh', marginBottom: '40vh'}}>
                    <div className='text-center m-5'>
                        <h1 className='text-uppercase text-danger'>Ошибка 404</h1>
                        <hr/>
                        <p className='text-muted'>Данная страница канула в небытие.</p>
                        <Link href={'/'}>
                            <a>
                                Вернитесь на главную
                            </a>
                        </Link>
                    </div>
                </Col>
                <Col />
            </Row>
        </>
    )
}

export default Custom404