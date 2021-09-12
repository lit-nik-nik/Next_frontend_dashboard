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
        disabled: false,
        error: {
            view: false,
            message: ''
        }
    }

    componentDidMount() {
        if (this.props.error) {
            if (JSON.parse(this.props.error).code === "ECONNREFUSED") {
                this.setState(({error}) => {
                    return (
                        error.view = true,
                        error.message =  'Сервер БД не отвечает. Авторизация не возможна.'
                    )
                })
                this.setState({disabled: true})
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

    autorization = async (e) => {
        e.preventDefault()

        const {user, pass} = this.state.login,
            redirect = () => Router.push('/')

        let salt = bcrypt.genSaltSync(10),
            hash = bcrypt.hashSync(pass, salt)

        await authUser(user, hash)
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('userId', res.data.userId)

                    setTimeout(redirect, 1000)
                } else {
                    this.setState(({error}) => {
                        error.view = true,
                        error.message = res.data.message
                    })
                    this.setState({login: {user: user, pass: ''}})
                }
            })
            .catch(err => {
                this.setState(({error}) => {
                    error.view = true,
                    error.message = err.response.message
                })
            })
    }

    render() {
        const {login, error, disabled} = this.state

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

                                    <Button type='submit' disabled={disabled} className="w-100 btn btn-lg btn-primary">Войти</Button>

                                    <ModalError
                                        show={error.view}
                                        onHide={()=> this.setState(({error}) => error.view = false)}
                                        error={error.message}
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
