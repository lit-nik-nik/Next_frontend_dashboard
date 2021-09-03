import { Container, Col, Row } from "react-bootstrap";
import Header from "../header";
import Navbar from "../navbar";
import Router from "next/router";
import {Component} from "react";
import Head from "next/head";

export class MainLyout extends Component {

    state = {
        check: ''
    }

    componentDidMount() {
        this.setState({check: localStorage.getItem('token')})

        if (!localStorage.getItem('token')) {
            Router.push('/auth')
        }
    }

    render() {
        const {check} = this.state

        const {children, title} = this.props

        if (check) {
            return (
                <>
                    <Head>
                        <title>{title} - Массив-Юг</title>
                    </Head>

                    <Header />

                    <Container fluid className='p-0'>
                        <Row>
                            <Col lg={2}>
                                <Navbar/>
                            </Col>
                            <Col lg={10} className='py-3 px-4'>
                                {children}
                            </Col>
                        </Row>
                    </Container>
                </>
            )
        } else {
            return (<></>)
        }


    }

}