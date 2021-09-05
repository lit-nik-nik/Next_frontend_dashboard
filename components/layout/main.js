import { Container, Col, Row } from "react-bootstrap";
import Header from "../header";
import Navbar from "../navbar";
import Router from "next/router";
import {Component} from "react";
import Head from "next/head";
import NavbarMini from "../navbar-mini";

export class MainLyout extends Component {

    state = {
        check: '',
        collapse: false
    }

    componentDidMount() {
        this.setState({check: localStorage.getItem('token')})

        if (!localStorage.getItem('token')) {
            Router.push('/auth')
        }

        if (localStorage.getItem('collapse')) {
            this.setState({collapse: localStorage.getItem('collapse')})
        }
    }

    onCollapseNav = () => {
        const {collapse} = this.state

        if (collapse) {
            localStorage.removeItem('collapse')
            this.setState({collapse: false})
        } else {
            localStorage.setItem('collapse', true)
            this.setState({collapse: true})
        }
    }

    render() {
        const {check, collapse} = this.state

        const {children, title, link} = this.props

        if (check) {
            return (
                <>
                    <Head>
                        <title>{title} - Массив-Юг</title>
                    </Head>

                    <Header onCollapseNav={this.onCollapseNav} />

                    <Container fluid className='p-0'>
                        <Row>
                            {!collapse ? (
                                <Col lg={2}>
                                    <Navbar link={link}/>
                                </Col>
                                ) : (
                                <Col lg={1}>
                                    <NavbarMini link={link}/>
                                </Col>
                            )}

                            <Col lg={!collapse ? 10 : 11} className='py-3 px-4'>
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