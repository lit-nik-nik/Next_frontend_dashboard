import style from '../styles/auth.module.css'
import React, {Component} from "react";
import {Row, Col, FloatingLabel, Form, Button} from "react-bootstrap";
import {getUsers} from "../services/auth/get";
import {authUser} from "../services/auth/post";
import bcrypt from 'bcryptjs';
import Router from "next/router";
import Link from "next/link";
import Head from "next/head";
import logo from "../public/logo.png"
import Image from "next/image";
import {changeKeyboard} from "../modules/change-keyboard";
import Cookies from 'js-cookie'
import CustomError from "../modules/error";

export default class Auth extends Component {

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
        errorData: null
    }

    componentDidMount() {
        if (this.props.error) this.setState({disabled: true})

        if (this.props.users) {
            this.setState({users: this.props.users})
        }

        this.barcodesInput.current.focus()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {variant} = this.state

        if (variant) this.barcodesInput.current.focus()
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

    autorization = async (e) => {
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
            .then(res => {
                if (res.status === 200) {
                    Cookies.set('token', res.data.token)
                    Cookies.set('userId', res.data.userId)

                    setTimeout(redirect, 1000)
                } else {
                    this.setState({errorData: res.data})
                    this.setState({login: {user, pass: '', barcode: newBarcode}})
                }
            })
            .catch(err => {
                this.setState({errorData: err.response.data})
            })
    }


    render() {
        const {login, disabled, errorData, variant} = this.state

        const loginPass =
            <>
                <FloatingLabel
                    controlId="login"
                    label="Логин"
                    className="mb-3"
                >
                    <Form.Control
                        required
                        isValid={login.user}
                        type="text"
                        placeholder="Логин"
                        list='users'
                        value={login.user}
                        onChange={e => this.setState(({login}) => login.user = e.target.value)}
                    />
                </FloatingLabel>
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

        const variantButton = (label, text) => {
            return (
                <Button
                    variant='link'
                    type='button'
                    className='p-0 text-white text-decoration-none'
                    onClick={() => {
                        this.clearInput(text)
                        this.setState({variant: !this.state.variant})
                    }}
                >{label}</Button>
            )

        }

        return (
            <>
                <Head>
                    <title>Авторизация пользователя - Массив-Юг</title>
                </Head>
                <Row>
                    <Col lg={12}>
                        <div className={`${style.authBody}`}>
                            <main className={`form-signin bg-dark ${style.formSign}`}>
                                <Row>
                                    <Col className='text-center'>
                                        <Image src={logo} alt="Массив-Юг" />
                                    </Col>
                                </Row>
                                <Form onSubmit={e => this.autorization(e)} autoComplete="off">
                                    <h1 className="h3 mb-3 fw-normal text-white text-center">Авторизация</h1>

                                    {variant ? barcodes : loginPass}

                                    <Row>
                                        <Col className='mb-3 text-start'>
                                            {variant ?
                                                variantButton('Вход по логину/паролю', 'barcode') :
                                                variantButton('Вход по штрих-коду', 'login')
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

                                    <CustomError error={errorData ? errorData : this.props.error} />
                                </Form>
                            </main>
                        </div>
                    </Col>
                </Row>
            </>
        )
    }

}

export async function getServerSideProps() {

    let users, error

    await getUsers()
        .then(res  => users = res.data.lists.employers)
        .catch(err => error = err.response.data)

    if (users) {
        return {
            props: {
                users
            }
        }
    }

    if (error) {
        return {
            props: {
                error
            }
        }
    }
}
