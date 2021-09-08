import style from '../styles/auth.module.css'
import {Component} from "react";
import {Row, Col, FloatingLabel, Form, Button} from "react-bootstrap";
import {getUsers} from "../services/auth/get";
import {authUser} from "../services/auth/post";
import bcrypt from 'bcryptjs';
import Router from "next/router";
import Link from "next/link";
import ModalError from "../modules/modals/modal-error";
import Head from "next/head";
import logo from "../public/logo.png"
import Image from "next/image";

export default class Auth extends Component {

    state = {
        users: [''],
        login: {
            user: '',
            pass: ''
        },
        error: false,
        errorMessage: ''
    }

    componentDidMount() {
        if (this.props.error) {
            if (JSON.parse(this.props.error).code === "ECONNREFUSED") {
                this.setState({
                    error: false,
                    errorMessage: 'Сервер БД не отвечает. Авторизация не возможна.'
                })
            }
        }

        if (this.props.users) {
            this.setState({users: this.props.users})
        }

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

    redirect = () => {
        Router.push('/')
    }

    autorization = async (e) => {
        e.preventDefault()

        const {user, pass} = this.state.login

        let salt = bcrypt.genSaltSync(10),
            hash = bcrypt.hashSync(pass, salt)

        await authUser(user, hash)
            .then(res => {
                console.log(hash)
                console.log(res)
                if (res.status === 200) {
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('userId', res.data.userId)

                    setTimeout(this.redirect, 1000)
                } else {
                    this.setState({
                        error: true,
                        errorMessage: res.data.message
                    })
                    this.setState({login: {user: user, pass: ''}})
                }
            })
    }

    render() {
        const {login, error, errorMessage} = this.state

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
                                            onChange={e => this.setState(({login}) => {
                                                return login.user = e.target.value
                                            })}
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
                                            onChange={e => this.setState(({login}) => {
                                                return login.pass = e.target.value
                                            })}
                                        />
                                    </FloatingLabel>

                                    <Col className='text-end mb-3'>
                                        <Link href='/reg'>
                                            <a className='text-white'>
                                                У меня нет учетки
                                            </a>
                                        </Link>
                                    </Col>

                                    <Button type='submit' className="w-100 btn btn-lg btn-primary">Войти</Button>

                                    <ModalError
                                        show={error}
                                        onHide={()=> this.setState({error: false})}
                                        error={errorMessage}
                                    />

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
        .catch(err => error = JSON.stringify(err))

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
