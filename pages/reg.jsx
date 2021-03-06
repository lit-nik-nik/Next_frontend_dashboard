import style from '../styles/auth.module.css'
import {Component} from "react";
import {Row, Col, Form, Button, FormGroup} from "react-bootstrap";
import Link from "next/link";
import {getUsers} from "../api/auth/get";
import {regUser} from "../api/reg/post";
import Router, {withRouter} from "next/router";
import ModalWindow from "../modules/modals/modal";
import Image from "next/image";
import logo from "../public/logo.png";
import {NologinLayout} from "../components/layout/nologin";
import {connect} from "react-redux";
import {setError} from "../redux/actions/actionsApp";

class Reg extends Component {

    state = {
        users: [],
        inputs: [
            {
                id: 'fio',
                label: 'Ф.И.О.',
                type: 'text',
                value: '',
                compare: false
            },
            {
                id: 'gender',
                label: 'Пол',
                type: 'radio',
                data: [
                    'Мужской',
                    'Женский',
                    'Иной'
                ],
                value: '',
                compare: false
            },
            {
                id: 'telephone',
                label: 'Телефон',
                type: 'tel',
                placeholder: '11 цифр начиная с 8',
                value: '',
            },
            {
                id: 'login',
                label: 'Логин',
                type: 'text',
                value: '',
                compare: false
            },
            {
                id: 'pass',
                label: 'Пароль',
                type: 'password',
                value: '',
                compare: false
            },
            {
                id: 'rpass',
                label: 'Повторите пароль',
                type: 'password',
                value: '',
                compare: false
            }],
        reg: {
            view: false,
            message: ''
        },
        errorData: null,
        disabled: false,
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

    componentDidMount() {
        this.setState({link: this.props.router.pathname})
        if (this.props.error) this.setState({disabled: true})

        if (this.props.users) {
            this.setState({users: this.props.users})
        }
    }

    compareLogin = (i) => {
        const {inputs, users} = this.state

        if (inputs[i].value === '') {
            this.setState(({inputs}) => inputs[i].compare = false)
        }

        if (inputs[i].compare) {
            users.map(user => {
                if (inputs[i].value === user) this.setState(({inputs}) => inputs[i].compare = false)
            })
        } else {
            this.setState(({inputs}) => inputs[i].compare = true)
        }
    }

    comparePass = (i) => {
        const {inputs} = this.state
        let pass, rpass

        inputs.map(input => {
            if (input.id === 'pass') pass = input.value
            else if (input.id === 'rpass') rpass = input.value
        })

        if (rpass === pass) this.setState(({inputs}) => inputs[i].compare = true)
        else this.setState(({inputs}) => inputs[i].compare = false)
    }

    compareInputs = (value, i) => {
        const {inputs} = this.state
        let reg = /8\d{10}/g

        if (inputs[i].id === 'telephone') {
            if (reg.test(inputs[i].value) && inputs[i].value.length === 11) this.setState(({inputs}) => inputs[i].compare = true)
            else this.setState(({inputs}) => inputs[i].compare = false)
        } else {
            if (value) this.setState(({inputs}) => inputs[i].compare = true)
            else this.setState(({inputs}) => inputs[i].compare = false)
        }

        if (inputs[i].id === 'pass') this.comparePass(i+1)
    }

    renderLabel = (label, value) => {
        if(value) {
            return (
                <Form.Label column lg='2' className='text-white' style={{fontSize: 12}}>
                    {label}
                </Form.Label>
            )
        }
    }

    renderInput = (arr) => {

        return arr.map((item, i) => {
            if (item.id === 'gender') {
                return (
                    <FormGroup as={Row} controlId={item.id} className='mb-3' key={i}>
                        {this.renderLabel(item.label,  true)}
                        <Col lg='10'>
                            {item.data.map((select, index) => (
                                <Form.Check
                                    inline
                                    isValid={item.compare}
                                    isInvalid={!item.compare}
                                    aria-label={select}
                                    label={select}
                                    name={item.id}
                                    type={item.type}
                                    id={`${item.id}-${item.type}-${index}`}
                                    key={index}
                                    onClick={async e => {
                                        await this.setState(({inputs}) => inputs[i].value = e.target.ariaLabel)
                                        this.compareInputs(e.target.ariaLabel, i)
                                    }}
                                />
                            ))}
                        </Col>
                    </FormGroup>
                )
            } else if (item.id === 'rpass') {
                return (
                    <FormGroup as={Row} controlId={item.id} className='mb-3' key={i}>
                        {this.renderLabel(item.label, item.value)}
                        <Col lg={item.value ? '10' : '12'}>
                            <Form.Control
                                required
                                isValid={item.compare}
                                isInvalid={!item.compare}
                                type={item.type}
                                placeholder={item.label}
                                value={item.value}
                                onChange={async e => {
                                    await this.setState(({inputs}) => inputs[i].value = e.target.value)
                                    this.comparePass(i)
                                }}
                            />
                        </Col>
                    </FormGroup>
                )
            } else if (item.id === 'login') {
                return (
                    <FormGroup as={Row} controlId={item.id} className='mb-3' key={i}>
                        {this.renderLabel(item.label, item.value)}
                        <Col lg={item.value ? '10' : '12'}>
                            <Form.Control
                                required
                                isValid={item.compare}
                                isInvalid={!item.compare}
                                type={item.type}
                                placeholder={item.label}
                                value={item.value}
                                onChange={async e => {
                                    await this.setState(({inputs}) => inputs[i].value = e.target.value)
                                    this.compareLogin(i)
                                }}
                            />
                        </Col>
                    </FormGroup>
                )
            } else if (item.id === 'telephone') {
                return (
                    <FormGroup as={Row} controlId={item.id} className='mb-3' key={i}>
                        {this.renderLabel(`${item.label} (${item.placeholder})`, item.value)}
                        <Col lg={item.value ? '10' : '12'}>
                            <Form.Control
                                required
                                isValid={item.compare}
                                isInvalid={!item.compare}
                                type={item.type}
                                placeholder={`${item.label} (${item.placeholder})`}
                                value={item.value}
                                pattern={item.pattern}
                                onChange={async e => {
                                    await this.setState(({inputs}) => inputs[i].value = e.target.value)
                                    this.compareInputs(e.target.value, i)
                                }}
                            />
                        </Col>
                    </FormGroup>
                )
            } else {
                return (
                    <FormGroup as={Row} controlId={item.id} className='mb-3' key={i}>
                        {this.renderLabel(item.label, item.value)}
                        <Col lg={item.value ? '10' : '12'}>
                            <Form.Control
                                required
                                isValid={item.compare}
                                isInvalid={!item.compare}
                                type={item.type}
                                placeholder={item.label}
                                value={item.value}
                                onChange={async e => {
                                    await this.setState(({inputs}) => inputs[i].value = e.target.value)
                                    this.compareInputs(e.target.value, i)
                                }}
                            />
                        </Col>
                    </FormGroup>
                )
            }
        })
    }

    formSubmit = (e) => {
        e.preventDefault()
        const {inputs} = this.state
        let user = {},
            i = 0

        const redirect = () => Router.push('/auth')

        inputs.map(input => {
            if (input.compare) {
                if (input.id !== 'rpass') {
                    user[input.id] = input.value
                }
                i++
            }
        })

        if (i === 6) {
            regUser(user)
                .then(res => {
                    if (res.status === 201) {
                        this.setState(({reg}) => {
                            return (
                                reg.view = true,
                                reg.message = `${res.data.message}`
                            )
                        })
                        setTimeout(redirect, 2000)
                    }
                    else this.props.setError(res.data)
                })
                .catch(err => this.props.setError(err.response.data))
        }
        else {
            this.props.setError({
                    errors: [''],
                    message: 'Не все поля заполнены верно'
                })
        }

    }


    render() {
        const {inputs, disabled, reg, link, css} = this.state

        return (
            <>
                <NologinLayout title='Регистрация пользователя' link={link}>
                    <Row>
                        <Col lg={12}>
                            <div style={css.body}>
                                <main style={css.formSign} className={`form-signin bg-dark ${style.formSign}`}>
                                    <Row>
                                        <Col className='text-center'>
                                            <Image src={logo} alt="Массив-Юг" />
                                        </Col>
                                    </Row>
                                    <Form onSubmit={e => this.formSubmit(e)} autoComplete="off">
                                        <h1 className="h3 mb-3 fw-normal text-white text-center">Зарегистрируйся</h1>

                                        {this.renderInput(inputs)}

                                        <Col className='text-end mb-3'>
                                            <Link href='/auth'>
                                                <a className='text-decoration-none text-white'>
                                                    Я вспомнил свою учетку
                                                </a>
                                            </Link>
                                        </Col>

                                        <Button type='submit' disabled={disabled} className="w-100 btn btn-lg btn-primary">Сохранить</Button>
                                    </Form>

                                    <ModalWindow
                                        show={reg.view}
                                        onHide={()=> this.setState(({reg}) => reg.view = false)}
                                        message={reg.message}
                                    />

                                </main>
                            </div>
                        </Col>
                    </Row>
                </NologinLayout>
            </>
        )
    }
}

export default connect(null, {setError})(withRouter(Reg))

// export async function getServerSideProps() {
//
//     let users, error
//
//     await getUsers()
//         .then(res  => users = res.data.lists.employers)
//         .catch(err => error = err.response.data)
//
//     if (users) {
//         return {
//             props: {
//                 users
//             }
//         }
//     }
//
//     if (error) {
//         return {
//             props: {
//                 error
//             }
//         }
//     }
// }
