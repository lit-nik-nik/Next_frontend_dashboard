import {Button, Row, Col, Form, Dropdown, DropdownButton} from "react-bootstrap"
import {connect} from "react-redux";
import Link from "next/link"
import style from '../styles/header.module.css'
import Router from 'next/router'
import React, {ReactElement, useState} from "react";
import logo from '../public/logo.png'
import Image from "next/image";
import exitApp from "../modules/exit";
import ava from '../public/avatar.png'
import {getReboot} from "../api/app/get";
import {success, unSuccess} from "../redux/actions/actionsApp";

type UserType = {
    userName: string,
    sectorName: string,
    isOwner: boolean
}

type HeaderPropsType = {
    search: string,
    user: UserType,
    success:Function,
    unSuccess:Function,
    onCollapseNav:Function
}

type UserMenuType = {
    user: UserType,
    success:Function,
    unSuccess:Function,
}

const Header:React.FC<HeaderPropsType> = (props) => {

    const [value, setValue] = useState(props.search ? props.search : '')

    const searchOrder = (e) => {
        e.preventDefault();
        Router.push(`/orders?filter=${value}`)
    }

    return (
        <>
            <Row className="bg-dark p-0 shadow sticky-top w-100 m-0" style={{fontSize: 16}}>
                <Col lg={2} className='p-0'>
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
                <Col lg={8} className='p-0'>
                    <Form.Control
                        className={`w-100 text-white fw-bold ${style.searchPanel}`}
                        type="text"
                        placeholder="Поиск по заказам"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') Router.push(`/orders?filter=${value}`)
                        }}
                    />
                </Col>
                <Col lg={2} className='bg-dark pt-1 p-0 text-center text-white'>
                    <UserMenu user={props.user} success={props.success} unSuccess={props.unSuccess}/>
                </Col>
            </Row>
        </>
    )
}

const UserMenu:React.FC<UserMenuType> = ({user, unSuccess, success}) => {

    const title:ReactElement =
        <Row>
            <Col>
                <Image src={ava} width={45} height={45}  alt='avatar users'/>
            </Col>
            <Col style={{fontSize: 16}}>
                {user.userName} <br/> ({user.sectorName})
            </Col>
        </Row>

    const reboot:Function = async () => {
        await getReboot()
            .then(res => {
                success(res.data)
                setTimeout(unSuccess, 5000)
            })
            .catch(e => console.log(e.response))
    }

    return (
        <Dropdown drop='down'>
            <DropdownButton
                variant='dark'
                menuVariant='dark'
                align='end'
                title={title}
                className='text-end p-0 ps-1 pe-4 w-100 my-dropdown-user'
                style={{fontSize: 16}}
            >
                <Dropdown.Item
                    eventKey="1"
                >
                    <Link href='/constructor'>
                        <a className='text-decoration-none text-light'>
                            Конструктор
                        </a>
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item
                    eventKey="2"
                >
                    <Link href='/web-socket'>
                        <a className='text-decoration-none text-light'>
                            WebSocket
                        </a>
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item eventKey="3">Настройки</Dropdown.Item>
                <Dropdown.Item eventKey="4">Полномочия</Dropdown.Item>
                {user.isOwner ? (
                    <Dropdown.Item
                        eventKey="5"
                        onClick={() => reboot()}
                    >
                        Перезагрузка
                    </Dropdown.Item>
                ) : null}
                <Dropdown.Divider />
                <Dropdown.Item
                    onClick={() => exitApp()}
                >
                    Выход
                </Dropdown.Item>
            </DropdownButton>
        </Dropdown>
    )
}

export default connect(null, {success, unSuccess})(Header)