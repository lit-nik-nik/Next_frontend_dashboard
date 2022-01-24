import style from '../styles/auth.module.css'
import React, {Component} from "react";
import {connect} from 'react-redux';
import {Row, Col, FloatingLabel, Form, Button} from "react-bootstrap";
import {getUsers} from "../services/auth/get";
import {authUser} from "../services/auth/post";
import bcrypt from 'bcryptjs';
import Router, {withRouter} from "next/router";
import Link from "next/link";
import logo from "../public/logo.png"
import Image from "next/image";
import {changeKeyboard} from "../modules/change-keyboard";
import Cookies from 'js-cookie'
import {NologinLayout} from "../components/layout/nologin";
import {setError, setMainMenu, setUser} from "../redux/actions/actionsApp";
import {getJournals} from "../services/journals/get";
import {addMenu} from "../modules/menu/add-menu";

class Auth extends Component {

    constructor(props) {
        super(props);
        this.barcodesInput = React.createRef();
    }

    state = {
        users: [''],
        login: {
            user: '',
            pass: '',
            barcode: ''
        },
        variant: true,
        disabled: false,
        errorData: null,
        link: null,
        css: {
            body: {
                display: 'flex',
                alignItems: 'center',
                height: '85vh',
                paddingTop: '40px',
                paddingBottom: '40px'
            },
            formSign: {
                width: '100%',
                maxWidth: '450px',
                padding: '15px',
                margin: 'auto',
                backgroundColor: '#f5f5f5',
                boxShadow: '0 0 10px 10px #ccc',
                borderRadius: '15px'
            }
        }
    }

    async componentDidMount() {
        const {variant} = this.state

        if (localStorage.getItem('variant')) await this.setState({variant: localStorage.getItem('variant')})

        this.setState({link: this.props.router.pathname})
        if (this.props.error) this.setState({disabled: true})

        if (this.props.users) {
            this.setState({users: this.props.users})
        }

        if (variant === 'barcode') this.barcodesInput.current.focus()

        if (!Cookies.get('token')) localStorage.setItem('user', '')
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {variant} = this.state

        if (variant === 'barcode') this.barcodesInput.current.focus()

        if (!Cookies.get('token')) localStorage.setItem('user', '')
    }

    clearInput = (value) => {
        if (value === 'barcode') this.setState(({login}) => login.barcode = '')
        else if (value === 'login') this.setState(({login}) => {
            return (
                login.user = '',
                login.pass = ''
            )
        })
    }

    renderListUser = () => {
        return this.state.users.map((user, i) => {
            return (
                <option key={i}>
                    {user}
                </option>
            )
        })
    }

    auth = async (e) => {
        e.preventDefault()
        const {user, pass, barcode} = this.state.login,
            redirect = () => Router.push('/')

        let newBarcode = changeKeyboard(barcode)

        let salt = bcrypt.genSaltSync(10),
            hash = null

        if (pass) {
            hash = bcrypt.hashSync(pass, salt)
        }

        await authUser(user, hash, newBarcode)
            .then(async res => {
                if (res.status === 200) {
                    Cookies.set('token', res.data.token, {expires: 10/24})
                    Cookies.set('userId', res.data.userId, {expires: 10/24})
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    this.props.setUser(res.data.user)

                    await getJournals(res.data.token)
                        .then(result => {
                            this.props.setMainMenu(addMenu(result.data.journals))
                        })
                        .catch(err => this.props.setError(err.response?.data))

                    setTimeout(redirect, 1000)
                } else {
                    this.setState({errorData: res.data})
                    this.setState({login: {user, pass: '', barcode: newBarcode}})
                }
            })
            .catch(err => this.props.setError(err.response?.data))
    }


    render() {
        const {login, disabled, variant, link, css} = this.state

        const loginPass =
            <>
                <span className='my-arrow'>
                    <FloatingLabel
                        controlId="login"
                        label="Логин"
                        className="mb-3"
                    >
                            <Form.Control
                                required
                                className='my-login'
                                isValid={login.user}
                                type="text"
                                placeholder="Логин"
                                list='users'
                                value={login.user}
                                onChange={e => this.setState(({login}) => login.user = e.target.value)}
                            />
                    </FloatingLabel>
                </span>
                <datalist id='users'>
                    {this.renderListUser()}
                </datalist>

                <FloatingLabel
                    controlId="pass"
                    label="Пароль"
                    className="mb-3"
                >
                    <Form.Control
                        required
                        isValid={login.pass}
                        type="password"
                        placeholder="Пароль"
                        list='users'
                        value={login.pass}
                        onChange={e => this.setState(({login}) => login.pass = e.target.value)}
                    />
                </FloatingLabel>
            </>

        const barcodes =
            <>
                <FloatingLabel
                    controlId="pass"
                    label="Штрих-код"
                >
                    <Form.Control
                        required
                        isValid={login.barcode}
                        ref={this.barcodesInput}
                        onBlur={() => this.barcodesInput.current.focus()}
                        autoFocus
                        type="password"
                        placeholder="Штрих-код"
                        value={login.barcode}
                        onChange={e => this.setState(({login}) => login.barcode = e.target.value)}
                    />
                </FloatingLabel>
                <p className='text-white text-center mb-5'>отсканируйте ваш персональный штрих-код</p>
            </>

        const variantButton = (label, text, value) => {
            return (
                <Button
                    variant='link'
                    type='button'
                    className='p-0 text-white text-decoration-none'
                    onClick={async () => {
                        this.clearInput(text)
                        await this.setState({variant: value})
                        localStorage.setItem('variant', value)
                    }}
                >{label}</Button>
            )

        }

        return (
            <>
                <NologinLayout title='Авторизация пользователя' link={link}>
                    <Row>
                        <Col lg={12}>
                            <div style={css.body}>
                                <main style={css.formSign} className={`form-signin bg-dark ${style.formSign}`}>
                                    <Row>
                                        <Col className='text-center'>
                                            <Image src={logo} alt="Массив-Юг" />
                                        </Col>
                                    </Row>
                                    <Form onSubmit={e => this.auth(e)} autoComplete="off">
                                        <h1 className="h3 mb-3 fw-normal text-white text-center">Авторизация</h1>

                                        {variant === 'barcode' ? barcodes : loginPass}

                                        <Row>
                                            <Col className='mb-3 text-start'>
                                                {variant === 'barcode' ?
                                                    variantButton('Вход по логину/паролю', 'barcode', 'login') :
                                                    variantButton('Вход по штрих-коду', 'login', 'barcode')
                                                }
                                            </Col>
                                            <Col className='mb-3 text-end'>
                                                <Link href='/reg'>
                                                    <a className='text-white text-decoration-none'>
                                                        У меня нет учетки
                                                    </a>
                                                </Link>
                                            </Col>
                                        </Row>

                                        <Button type='submit' disabled={disabled} className="w-100 btn btn-lg btn-primary">Войти</Button>

                                    </Form>
                                </main>
                            </div>
                        </Col>
                    </Row>
                </NologinLayout>
            </>
        )
    }

}

export default connect(null, {setError, setUser, setMainMenu})(withRouter(Auth))

export async function getServerSideProps() {

    let users, error

    await getUsers()
        .then(res  => users = res.data.lists.employers)
        .catch(err => error = err.response?.data)

    if (users) {
        return {
            props: {
                users
            }
        }
    }
    else if (error) {
        return {
            props: {
                error
            }
        }
    }
    else {
        return {
            props: {}
        }
    }
}
