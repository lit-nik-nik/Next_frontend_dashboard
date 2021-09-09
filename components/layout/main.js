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
        collapse: false,
        screenMode: null
    }

    componentDidMount() {
        this.setState({check: localStorage.getItem('token')})

        if (!localStorage.getItem('token')) {
            Router.push('/auth')
        }

        if (localStorage.getItem('collapse')) {
            this.setState({collapse: localStorage.getItem('collapse')})
        }

        this.onResize()

        window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
    }

    onResize = async () => {
        if (window.innerWidth < 992) this.setState({screenMode: "mobile"})
        else this.setState({screenMode: "desktop"})
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

        const {check, collapse, screenMode} = this.state

        const {children, title, link} = this.props

        if (check) {
            return (
                <>
                    <Head>
                        <title>{title} - Массив-Юг</title>
                    </Head>

                    {screenMode === 'desktop' ? (
                        <Header onCollapseNav={this.onCollapseNav} />
                    ) : null}

                    <Container fluid className='p-0'>
                        <Row>
                            <Col lg={collapse ? 1 : 2} className='nav-menu'>
                                {collapse ? <NavbarMini link={link}/> : <Navbar link={link}/>}
                            </Col>

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