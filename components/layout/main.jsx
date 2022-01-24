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
import {setError, setMainMenu, setTokenTimer, setUser} from "../../redux/actions/actionsApp";
import Loading from "../../modules/loading";
import MyToast from "../../modules/toast/toast";
import {addMenu} from "../../modules/menu/add-menu";

class MainLayout extends Component {

    state = {
        collapse: false,
        screenMode: null
    }

    async componentDidMount() {
        if (!this.props.token) exitApp()

        if (!this.props.user) {
            if (localStorage.getItem('user')) {
                this.props.setUser(JSON.parse(localStorage.getItem('user')))
                await getJournals(this.props.token)
                    .then(result => {
                        this.props.setMainMenu(addMenu(result.data.journals))
                    })
                    .catch(err => this.props.setError(err.response?.data))

            }
        }

        if (localStorage.getItem('collapse')) {
            this.setState({collapse: localStorage.getItem('collapse')})
        }

        await this.onResize()

        window.addEventListener('resize', this.onResize)

        // this.props.setTokenTimer(setTimeout(() => exitApp(), 900000))
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        // clearTimeout(this.props.timerID)
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

    render() {
        const {collapse, screenMode} = this.state

        const {children, title, link, token, search, success, user, fullscreen, mainMenu} = this.props

        return (
            <>
                {token ? (
                    <>
                        <Head>
                            <title>{title} - Массив-Юг</title>
                        </Head>

                        {fullscreen ?
                            null :
                            screenMode === 'desktop' ? (
                                <Header onCollapseNav={this.onCollapseNav} user={user} search={search ? search : ''}/>
                            ) : null
                        }

                        <Row style={{overflowX: "hidden"}}>
                            {fullscreen ?
                                <Col lg={1} className='nav-menu' style={{width: '4%'}}>
                                    <NavbarMini link={link} menu={mainMenu} />
                                </Col>
                                :
                                <Col lg={collapse ? 1 : 2} className='nav-menu' style={collapse ? {width: '4%'} : {}}>
                                    {collapse ? <NavbarMini link={link} menu={mainMenu} /> : <Navbar link={link} menu={mainMenu} />}
                                </Col>
                            }

                            <Col lg={fullscreen || collapse ? 11 : 10} className='py-1 px-4' style={fullscreen || collapse ? {width: '96%'} : {}}>
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
    fullscreen: state.app.fullscreen,
    timerID: state.app.activeTimer,
    errorRedux: state.app.app_error,
    success: state.app.app_success,
    user: state.app.user,
    mainMenu: state.app.mainMenu
})

export default connect(mapSTP, {setTokenTimer, setUser, setError, setMainMenu})(MainLayout)
