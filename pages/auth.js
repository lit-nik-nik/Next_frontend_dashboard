import style from '../styles/auth.module.css'
import {Component} from "react";
import {Row, Col, FloatingLabel, Form, Button} from "react-bootstrap";
import {getUsers} from "../services/auth/get";
import {authUser} from "../services/auth/post";
import bcrypt from 'bcryptjs';
import Router from "next/router";
import Link from "next/link";

export default class Auth extends Component {

    state = {
        users: this.props.users,
        login: {
            user: '',
            pass: ''
        },
        error: {
            active: false,
            message: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.error !== prevState.error) {
            this.render()
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
                if (res.status === 200) {
                    localStorage.setItem('token', res.token)
                    localStorage.setItem('userId', res.userId)

                    setTimeout(this.redirect, 1000)
                } else {
                    console.log(res)
                    this.setState(({error}) => {
                        error.active = true,
                        error.message = res.data.message
                    })
                }
            })
    }

    render() {
        const {login, error} = this.state

        let divError

        if (this.state.error.active) {
            divError = <div className={`text-danger text-center`}>
                {error.message}
            </div>
        }

        return (
            <>
                <Row>
                    <Col lg={12}>
                        <div className={style.authBody}>
                            <main className={`form-signin ${style.formSign}`}>
                                <form onSubmit={e => this.autorization(e)}>
                                    <h1 className="h3 mb-3 fw-normal text-center">Авторизация</h1>

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
                                            <a>
                                                У меня нет учетки
                                            </a>
                                        </Link>
                                    </Col>

                                    <Button type='submit' className="w-100 btn btn-lg btn-primary">Войти</Button>

                                    {divError}

                                </form>
                            </main>
                        </div>
                    </Col>
                </Row>
            </>
        )
    }

}

export async function getServerSideProps() {

    return {
        props: {
            users: await getUsers()
        }
    }

}
