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
import Cookies from 'js-cookie';

export class MainLayout extends Component {

    state = {
        collapse: false,
        screenMode: null,
        menu: globalState.menu,
        render: 0,
        errorView: false,
        errorData: null,
        user: {},
        checkToken: null
    }

    async componentDidMount() {
        if (!this.props.token) exitApp()
        if (localStorage.getItem('user')) {
            const {userName, sectorName} = JSON.parse(localStorage.getItem('user'))
            this.setState(({user}) => {
                return (
                    user.userName = userName,
                    user.sectorName = sectorName
                )
            })
        }

        this.addMenu()

        if (localStorage.getItem('collapse')) {
            this.setState({collapse: localStorage.getItem('collapse')})
        }

        this.onResize()

        window.addEventListener('resize', this.onResize)

        this.setState({checkToken: setInterval(this.checkToken, 1800000)})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        clearInterval(this.state.checkToken)
    }

    checkToken = () => {
        const token = Cookies.get('token')

        if (!token) exitApp()
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
        let submenu = []

        await getJournals(token)
            .then(res => journals = res.data.journals)
            .catch(({response}) => {
                console.log(response)
                this.setState({errorView: true})
                this.setState({errorData: response.data})
            })

        if (journals) journals.map(item => {
            let objMenu = {
                label: item.name,
                link: `/journal/${item.id}/plans`
            }

            submenu.push(objMenu)
        })

        menu.map(item => {
            if (item.id === 'journals') {
                item.submenu = submenu
            }
        })


        await this.setState({menu})
    }

    render() {
        const {collapse, screenMode, menu, errorData, errorView, user} = this.state

        const {children, title, link, token, error, search} = this.props

        return (
            <>
                {token ? (
                    <>
                        <Head>
                            <title>{title} - Массив-Юг</title>
                        </Head>

                        {screenMode === 'desktop' ? (
                            <Header onCollapseNav={this.onCollapseNav} user={user} search={search ? search : ''}/>
                        ) : null}

                        <Container fluid className='p-0'>
                            <Row>
                                <Col lg={collapse ? 1 : 2} className='nav-menu'>
                                    {collapse ? <NavbarMini link={link} menu={menu} /> : <Navbar link={link} menu={menu} />}
                                </Col>

                                <Col lg={!collapse ? 10 : 11} className='py-1 px-4'>
                                    {children}
                                    {errorView ?
                                        <CustomError error={errorData} cleanError={() => this.setState({errorData: null})} /> :
                                        error ?
                                            <CustomError error={error} /> :
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