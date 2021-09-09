import {Button, Row, Col, Form} from "react-bootstrap"
import Link from "next/link"
import style from '../styles/header.module.css'
import Router from 'next/router'
import {useState} from "react";
import logo from '../public/logo.png'
import Image from "next/image";

const Header = (props) => {

    const [value, setValue] = useState('')

    const searchOrder = (e) => {
        e.preventDefault();
        Router.push(`/order/${value}`)
        setValue('')
    }

    const exitUser = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('userId')

        Router.push('/auth')
    }

    return (
        <>
            <Row className="bg-dark p-0 shadow" style={{fontSize: 16}}>
                <Col lg={2}>
                    <Row>
                        <Col lg={2} className='text-center'>
                            <Button
                                type='button'
                                variant="link"
                                onClick={() => props.onCollapseNav()}
                            >
                                <i className="bi bi-list fw-bold text-white " style={{fontSize: 30}} />
                            </Button>
                        </Col>
                        <Col lg={10} className='bg-dark text-center' style={{fontSize: 16, height: `60px`}}>
                            <Link href='/'>
                                <a className="text-white text-decoration-none text-uppercase">
                                    <Image src={logo} alt="Массив-Юг" width={160} height={60}/>
                                </a>
                            </Link>
                        </Col>
                    </Row>
                </Col>
                <Col lg={9}>
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
                            <Button
                                variant='link'
                                className="py-0 text-decoration-none text-warning"
                                onClick={e => exitUser(e)}
                            >
                                Выход
                            </Button>
                        </li>
                    </ul>
                </Col>
            </Row>
        </>
    )
}

export default Header;


