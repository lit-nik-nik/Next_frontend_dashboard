import {Button, Row, Col, Form, Dropdown, DropdownButton} from "react-bootstrap"
import {connect} from "react-redux";
import Link from "next/link"
import style from '../styles/header.module.css'
import Router from 'next/router'
import {useState} from "react";
import logo from '../public/logo.png'
import Image from "next/image";
import exitApp from "../modules/exit";
import ava from '../public/avatar.png'
import {getReboot} from "../services/app/get";
import {success, unSuccess} from "../redux/actions/actionsApp";

const Header = (props) => {

    const [value, setValue] = useState(props.search ? props.search : '')

    const searchOrder = (e) => {
        e.preventDefault();
        Router.push(`/orders?filter=${value}`)
    }

    const reboot = async () => {
        await getReboot()
            .then(res => {
                props.success(res.data)
                setTimeout(props.unSuccess, 5000)
            })
            .catch(e => console.log(e.response))
    }

    const title = <Row>
        <Col>
            <Image src={ava} width={45} height={45}  alt='avatar users'/>
        </Col>
        <Col style={{fontSize: 16}}>
            {props.user.userName} <br/> ({props.user.sectorName})
        </Col>
    </Row>

    return (
        <>
            <Row className="bg-dark p-0 shadow sticky-top" style={{fontSize: 16}}>
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
                <Col lg={8}>
                    <Form onSubmit={e => searchOrder(e)}>
                        <input
                            className={`w-100 text-white fw-bold ${style.searchPanel}`}
                            type="text"
                            placeholder="Поиск по заказам"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                        />
                    </Form>
                </Col>
                <Col lg={2} className='bg-dark pt-1 p-0 text-center text-white'>
                    <Dropdown drop='down'>
                        <DropdownButton
                            variant='dark'
                            menuVariant='dark'
                            align='end'
                            title={title}
                            className='text-end p-0 ps-1 pe-4 w-100 my-dropdown-user'
                            style={{fontSize: 16}}
                        >
                            <Dropdown.Item eventKey="1">Настройки</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Полномочия</Dropdown.Item>
                            {props.user.isOwner ? (
                                <Dropdown.Item
                                    eventKey="3"
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
                </Col>
            </Row>
        </>
    )
}

export default connect(null, {success, unSuccess})(Header)