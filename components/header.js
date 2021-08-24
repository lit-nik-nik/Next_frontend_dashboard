import {Col, Form} from "react-bootstrap"
import Link from "next/link"
import style from '../styles/header.module.css'
import Router from 'next/router'
import {useState} from "react";

const Header = () => {

    const [value, setValue] = useState('')

    const searchOrder = (e) => {
        e.preventDefault();
        Router.push(`/order/${value}`)
        setValue('')
    }

    return (
        <header className='navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow' style={{fontSize: 16}}>
            <Col lg={2} className='bg-dark py-3 text-center'>
                <Link href='/'>
                    <a className="text-white mb-3 text-decoration-none text-uppercase">
                        Массив-Юг
                    </a>
                </Link>
            </Col>
            <Col>
                <Form onSubmit={e => searchOrder(e)}>
                    <input
                        className={`w-100 text-white fw-bold ${style.searchPanel}`}
                        type="text"
                        placeholder="Поиск по номеру заказа"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        />
                </Form>
            </Col>
            <Col lg={1} className='bg-dark py-3 px-3 text-center text-white'>
                <ul className="navbar-nav">
                    <li className="nav-item text-nowrap">
                        <Link href="/auth">
                            <a className="nav-link py-0">Выход</a>
                        </Link>
                    </li>
                </ul>
            </Col>
        </header>
    )
}

export default Header;


