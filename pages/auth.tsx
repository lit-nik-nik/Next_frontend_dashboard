import style from '../styles/auth.module.css'
import React, {useEffect, useRef, useState} from "react";
import {connect} from 'react-redux';
import {Row, Col, FloatingLabel, Form, Button} from "react-bootstrap";
import {useRouter} from "next/router";
import Link from "next/link";
import logo from "../public/logo.png"
import Image from "next/image";
import Cookies from 'js-cookie'
import {NologinLayout} from "../components/layout/nologin";
import {authUser, getUsers} from "../redux/actions/actionsApp";

type LoginType = {
    user: string,
    pass: string,
    barcode: string
}

type AuthPagePostType = {
    setUser: Function,
    setMainMenu: Function,
    setError: Function,
    getUsers: Function,
    authUser: Function,
    users: [],
    error: any
}

type ButtonAuthPropsType = {
    label: string,
    text: string,
    value: string,
    setVariable: Function,
    clearInput: Function
}

type LoginAuthPropsType = {
    login: LoginType,
    setLogin: Function,
    users: []
}

type BarcodesAuthPropsType = {
    login: LoginType,
    setLogin: Function
}

const AuthPage:React.FC<AuthPagePostType> = (props) => {
    const router = useRouter()

    const [users, setUsers] = useState<string[]>([])
    const [variable, setVariable] = useState<string>('login')
    const [login, setLogin] = useState<LoginType>({user: '', pass: '', barcode: ''})
    const [disabled, setDisabled] = useState<boolean>(true)

    useEffect(() => {
        props.getUsers()
        setUsers(props.users)
    }, [users])

    useEffect(() => {
        if (localStorage.getItem('variable')) setVariable(localStorage.getItem('variable'))
        else localStorage.setItem('variable', variable)
    }, [variable])

    useEffect(() => {
        if (login.user && login.pass) setDisabled(false)
        else if (login.barcode) setDisabled(false)
        else setDisabled(true)
    }, [login.user, login.pass, login.barcode])

    useEffect(() => {
        if (!Cookies.get('token')) {
            localStorage.setItem('user', '')
        }
    })

    useEffect(() => {
        setLogin({...login, pass: '', barcode: ''})
    }, [props.error])

    const clearInput = (value) => {
        if (value === 'barcode') setLogin({...login, barcode: ''})
        else if (value === 'login') setLogin({...login, user: '', pass: '' })
    }

    const setAuth = async (e) => {
        e.preventDefault()
        props.authUser(login)
    }

    return (
        <NologinLayout title='Авторизация пользователя' link={router.pathname}>
            <Row>
                <Col lg={12}>
                    <div className={`${style.body}`}>
                        <div className={`form-sign bg-dark ${style.formSign}`}>
                            <Row>
                                <Col className='text-center'>
                                    <Image src={logo} alt="Массив-Юг"/>
                                </Col>
                            </Row>
                            <Form onSubmit={e => setAuth(e)} autoComplete="off">
                                <h1 className="h3 mb-3 fw-normal text-white text-center">Авторизация</h1>

                                {variable === 'barcode' ?
                                    <BarcodesAuth login={login} setLogin={setLogin} /> :
                                    <LoginAuth login={login} setLogin={setLogin} users={props.users}/>
                                }

                                <Row>
                                    <Col className='mb-3 text-start'>
                                        {variable === 'barcode' ?
                                            <ButtonAuth
                                                label={'Вход по логину/паролю'}
                                                text={'barcode'}
                                                value={'login'}
                                                setVariable={setVariable}
                                                clearInput={clearInput}
                                            /> :
                                            <ButtonAuth
                                                label={'Вход по штрих-коду'}
                                                text={'login'}
                                                value={'barcode'}
                                                setVariable={setVariable}
                                                clearInput={clearInput}
                                            />
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

                                <Button
                                    type='submit'
                                    disabled={disabled}
                                    className="w-100 btn btn-lg btn-primary"
                                >
                                    Войти
                                </Button>

                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </NologinLayout>
    )
}

const BarcodesAuth:React.FC<BarcodesAuthPropsType> = (props) => {
    const barcodeInput = useRef()

    return (
        <>
            <FloatingLabel
                controlId="pass"
                label="Штрих-код"
            >
                <Form.Control
                    required
                    isValid={!!props.login.barcode}
                    ref={barcodeInput}
                    onBlur={() => {
                        // @ts-ignore
                        barcodeInput.current.focus()
                    }
                    }
                    autoFocus
                    type="password"
                    placeholder="Штрих-код"
                    value={props.login.barcode}
                    onChange={e => props.setLogin({...props.login, barcode: e.target.value})}
                />
            </FloatingLabel>
            <p className='text-white text-center mb-5'>отсканируйте ваш персональный штрих-код</p>
        </>
    )

}

const LoginAuth:React.FC<LoginAuthPropsType> = (props) => {

    const renderListUser = () => {
        return props.users.map((user, i) => {
            return (
                <option key={i}>{user}</option>
            )
        })
    }

    return (
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
                            autoFocus
                            isValid={!!props.login.user}
                            type="text"
                            placeholder="Логин"
                            list='users'
                            value={props.login.user}
                            onChange={e => props.setLogin({...props.login, user: e.target.value})}
                        />
                </FloatingLabel>
            </span>
            <datalist id='users'>
                {props.users.length > 0 && renderListUser()}
            </datalist>

            <FloatingLabel
                controlId="pass"
                label="Пароль"
                className="mb-3"
            >
                <Form.Control
                    required
                    isValid={!!props.login.pass}
                    type="password"
                    placeholder="Пароль"
                    list='users'
                    value={props.login.pass}
                    onChange={e => props.setLogin({...props.login, pass: e.target.value})}
                />
            </FloatingLabel>
        </>
    )
}

const ButtonAuth: React.FC<ButtonAuthPropsType> = (props) => {

    return (
        <Button
            variant='link'
            type='button'
            className='p-0 text-white text-decoration-none'
            onClick={async () => {
                props.clearInput(props.text)
                props.setVariable(props.value)
                localStorage.setItem('variable', props.value)
            }}
        >{props.label}</Button>
    )
}



const mapSTP = state => ({
    users: state.app.users,
    error: state.app.app_error,
    loading: state.app.loading
})

export default connect(mapSTP, {getUsers, authUser})(AuthPage)