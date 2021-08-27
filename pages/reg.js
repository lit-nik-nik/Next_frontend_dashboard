import style from '../styles/auth.module.css'
import {Component} from "react";
import {Row, Col, FloatingLabel, Form, Button} from "react-bootstrap";
import { FioSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import bcrypt from 'bcryptjs';
import Link from "next/link";

export default class Reg extends Component {

    state = {
        API_TOKEN: '22ab666f18c1abef8846d6a89f6eb0d18adc650d',
        testValue: '',
        input: [
            {
                id: 'fio',
                label: 'Ф.И.О.',
                type: 'text',
                value: '',
            },
            {
                id: 'gender',
                label: 'Пол',
                type: 'select',
                data: [
                    'Мужской',
                    'Женский',
                    'Другой'
                ],
                value: '',
            },
            {
                id: 'telephone',
                label: 'Телефон',
                type: 'tel',
                value: '',
            },
            {
                id: 'login',
                label: 'Логин',
                type: 'text',
                value: '',
            },
            {
                id: 'pass',
                label: 'Пароль',
                type: 'password',
                value: '',
            },
            {
                id: 'rpass',
                label: 'Повторите пароль',
                type: 'password',
                value: '',
            }],
        reg: {}
    }

    renderInput = (arr) => {
        return arr.map((item, i) => {
            if (item.id === 'fio') {
                return (
                    <>
                        <label for={item.id}>{item.label}</label>
                        <FioSuggestions
                            token={this.state.API_TOKEN}
                            delay={500}
                            minChars={5}
                            value={item.value}
                            onChange={e => this.setState(({input}) => input[i].value = e.target.value)}
                        />
                    </>
                )
            } else {
                return (
                    <FloatingLabel
                        controlId={item.id}
                        label={item.label}
                        className="mb-3"
                        key={i}
                    >
                        <Form.Control
                            required
                            isValid={item.value}
                            type={item.type}
                            placeholder={item.label}
                            value={item.value}
                            onChange={e => this.setState(({input}) => input[i].value = e.target.value)}
                        />
                    </FloatingLabel>
                )
            }
        })
    }


    render() {
        const {input, reg, testValue} = this.state

        let salt = bcrypt.genSaltSync(10),
            hash = bcrypt.hashSync("Пароль", salt),
            hash2 = '$2a$10$OpRNbxmy8t.c5MgqeULpreN4VkQdgMGolZa1oRzVYSnRPzGFtzWhK'


            console.log(bcrypt.compareSync("Пароль", hash2))


        return (
            <>
                <Row>
                    <Col lg={12}>
                        <div className={style.authBody}>
                            <main className={`form-signin ${style.formSign}`}>
                                <Form onSubmit={e => e.preventDefault()}>
                                    <h1 className="h3 mb-3 fw-normal text-center">Зарегистрируйся</h1>

                                    {this.renderInput(input)}

                                    <Col className='text-end mb-3'>
                                        <Link href='/auth'>
                                            <a>
                                                Я вспомнил свою учетку
                                            </a>
                                        </Link>
                                    </Col>

                                    <Button className="w-100 btn btn-lg btn-primary">Сохранить</Button>
                                </Form>
                            </main>
                        </div>
                    </Col>
                </Row>
            </>
        )
    }

}
