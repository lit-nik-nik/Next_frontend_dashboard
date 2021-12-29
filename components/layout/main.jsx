import { Col, Row } from "react-bootstrap";
import {connect} from "react-redux";
import Header from "../header";
import Navbar from "../navbar";
import React, {Component} from "react";
import Head from "next/head";
import NavbarMini from "../navbar-mini";
import {globalState} from "../../data/globalState";
import {getJournals} from "../../services/journals/get";
import exitApp from "../../modules/exit";
import CustomError from "../../modules/error";
import {setError, setTokenTimer, setUser} from "../../redux/actions/actionsApp";
import Loading from "../../modules/loading";
import MyToast from "../../modules/toast/toast";

class MainLayout extends Component {

    state = {
        collapse: false,
        screenMode: null,
        menu: globalState.menu
    }

    async componentDidMount() {
        if (!this.props.token) exitApp()
        if (localStorage.getItem('user')) {
            this.props.setUser(JSON.parse(localStorage.getItem('user')))
        }

        if (localStorage.getItem('collapse')) {
            this.setState({collapse: localStorage.getItem('collapse')})
        }

        await this.onResize()

        window.addEventListener('resize', this.onResize)

        this.props.setTokenTimer(setInterval(this.clearCookies, 900000))
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user !== prevProps.user) {
            await this.addMenu()
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        clearInterval(this.props.timerID)
    }

    clearCookies = () => {
        exitApp()
    }

    onResize = async () => {
        if (window.innerWidth < 992) this.setState({screenMode: "mobile"})
        else this.setState({screenMode: "desktop"})
    }

    //переписать

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
            .then(res => {
                journals = res.data.journals
            })
            .catch(({response}) => {
                this.props.setError(response.data)
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
        const {collapse, screenMode, menu} = this.state

        const {children, title, link, token, search, success, user} = this.props

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

                        <Row>
                            <Col lg={collapse ? 1 : 2} className='nav-menu'>
                                {collapse ? <NavbarMini link={link} menu={menu} /> : <Navbar link={link} menu={menu} />}
                            </Col>

                            <Col lg={!collapse ? 10 : 11} className='py-1 px-4'>
                                {children}

                                <Loading />

                                <CustomError />

                                {success ? <MyToast data={success} /> : null}
                            </Col>
                        </Row>
                    </>
                ) : (
                    <></>
                )}
            </>
        )
    }
}

const mapSTP = state => ({
        timerID: state.app.activeTimer,
        errorRedux: state.app.app_error,
        success: state.app.app_success,
        user: state.app.user
})

export default connect(mapSTP, {setTokenTimer, setUser, setError})(MainLayout)
