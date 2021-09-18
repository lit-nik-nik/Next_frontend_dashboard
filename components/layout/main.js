import { Container, Col, Row } from "react-bootstrap";
import Header from "../header";
import Navbar from "../navbar";
import {Component} from "react";
import Head from "next/head";
import NavbarMini from "../navbar-mini";
import {globalState} from "../../data/globalState";
import {getJournals} from "../../services/journals/get";
import exitApp from "../../modules/exit";

export class MainLyout extends Component {

    state = {
        token: '',
        collapse: false,
        screenMode: null,
        menu: []
    }

    async componentDidMount() {
        await this.setState({token: localStorage.getItem('token')})

        if (!localStorage.getItem('token')) {
            exitApp()
        }

        this.addMenu()

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

    addMenu = async () => {
        const {token} = this.state
        let journals

        this.setState({menu: globalState.menu})

        await getJournals(token)
            .then(res => journals = res.data.journals)
            .catch(err => {
                this.setState(({error}) => {
                    return (
                        error.view = true,
                        error.message = err.response.data.message
                    )
                })

                exitApp()
            })

        if (journals) journals.map(item => {
            let objMenu = {
                label: item.name,
                link: `/journal/${item.id}`,
                icon: 'bi-table'
            }

            this.setState({menu: [...this.state.menu, objMenu]})
        })
    }

    render() {
        const {token, collapse, screenMode, menu} = this.state

        const {children, title, link} = this.props

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