import {MainLyout} from "../components/layout/main"
import style from '../styles/auth.module.css'
import {Component} from "react";
import {Row, Col, FloatingLabel, Form} from "react-bootstrap";
import {getUsers} from "../services/auth/get";

export default class Home extends Component {

    state = {
        users: this.props.users,
        filterUser: [],
        login: {
            user: '',
            pass: ''
        },
        activeUser: '',
        pass: ''
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

    render() {
        const {login} = this.state


        return (
            <MainLyout>
                <Row>
                    <Col lg={12}>
                        <div className={style.authBody}>
                            <main className={`form-signin ${style.formSign}`}>
                                <form onSubmit={e => {
                                    e.preventDefault()
                                    console.log(login)
                                    this.setState(({login}) => {
                                        return (
                                            login.user = '',
                                            login.pass = ''
                                        )
                                    })
                                }}>
                                    <h1 className="h3 mb-3 fw-normal text-center">Авторизация</h1>

                                    <FloatingLabel
                                        controlId="user"
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

                                    <button className="w-100 btn btn-lg btn-primary" type="submit">Войти</button>
                                </form>
                            </main>
                        </div>
                    </Col>
                </Row>
            </MainLyout>
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
