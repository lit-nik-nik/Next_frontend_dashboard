import {Container, Col, Row, Nav, Navbar} from "react-bootstrap";
import {Component} from "react";
import Head from "next/head";
import Link from "next/link";
import Version from "../../modules/version";
import CustomError from "../../modules/error";

export class NologinLayout extends Component {

    state = {
        nav: [
            {
                link: '/auth',
                label: 'Авторизация'
            },
            {
                link: '/reg',
                label: 'Регистрация'
            },
            {
                link: '/nl-at-order',
                label: 'Прием-передача заказов'
            }
        ]
    }

    render() {

        const {children, title, link} = this.props
        const {nav} = this.state

        return (
            <>
                <Head>
                    <title>{title} - Массив-Юг</title>
                </Head>

                <Container fluid className='p-0'>
                    <Navbar bg="dark" variant="dark">
                        <Container fluid>
                            <Nav>
                                {nav.map((item, i) => {
                                    return (
                                        <Link href={item.link} key={i}>
                                            <a className={`nav-link ${item.link === link ? 'active' : null}`}>{item.label}</a>
                                        </Link>
                                    )
                                })}
                            </Nav>
                        </Container>
                    </Navbar>
                    <Row>
                        <Col className='py-1 px-4'>
                            {children}
                        </Col>

                        <CustomError />

                        <Version />
                    </Row>
                </Container>
            </>
        )
    }
}