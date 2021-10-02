import { Container, Col, Row } from "react-bootstrap";
import Header from "../header";
import Navbar from "../navbar";
import {Component} from "react";
import Head from "next/head";
import NavbarMini from "../navbar-mini";
import {globalState} from "../../data/globalState";
import {getJournals} from "../../services/journals/get";
import exitApp from "../../modules/exit";
import CustomError from "../../modules/error";

export class MainLayout extends Component {

    state = {
        collapse: false,
        screenMode: null,
        menu: globalState.menu,
        render: 0,
        errorView: false,
        errorData: null
    }

    async componentDidMount() {
        if (!this.props.token) exitApp()

        this.addMenu()

        if (localStorage.getItem('collapse')) {
            this.setState({collapse: localStorage.getItem('collapse')})
        }

        this.onResize()

        window.addEventListener('resize', this.onResize)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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

    addMenu = async () => {
        const {token} = this.props
        let journals, menu = [...globalState.menu]

        await getJournals(token)
            .then(res => journals = res.data.journals)
            .catch(err => {
                this.setState({errorView: true})
                this.setState({errorData: err.response?.data})
            })

        if (journals) journals.map(item => {
            let objMenu = {
                label: item.name,
                link: `/journal/${item.id}/plans`,
                icon: 'bi-table'
            }

            menu.push(objMenu)
        })

        await this.setState({menu})
    }

    render() {
        const {collapse, screenMode, menu, errorData, errorView} = this.state

        const {children, title, link, token, error} = this.props

        return (
            <>
                {token ? (
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
                                    {collapse ? <NavbarMini link={link} menu={menu} /> : <Navbar link={link} menu={menu} />}
                                </Col>

                                <Col lg={!collapse ? 10 : 11} className='py-3 px-4'>
                                    {children}
                                    {errorView ?
                                        <CustomError error={errorData}/> :
                                        error ?
                                            <CustomError error={error}/> :
                                            null
                                    }
                                </Col>
                            </Row>
                        </Container>
                    </>
                ) : (
                    <></>
                )}
            </>
        )
    }
}