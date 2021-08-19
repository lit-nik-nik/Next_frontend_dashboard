import {Col, Row} from "react-bootstrap"
import Link from "next/link"
import style from '../styles/header.module.css'

const Header = (props) => {

    return (
        <header className='navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow' style={{fontSize: 16}}>
            <Col lg={2} className='bg-dark py-3 text-center'>
                <Link href='/'>
                    <a className="text-white mb-3 text-decoration-none text-uppercase">
                        Массив-Юг
                    </a>
                </Link>
            </Col>
            <Col className=''>
                <input className={`w-100 ${style.searchPanel}`} type="text" placeholder="Поиск по номеру заказа"/>
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


