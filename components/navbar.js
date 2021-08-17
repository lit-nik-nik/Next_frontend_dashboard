import {Component} from "react";
import Link from "next/link";

export default class Navbar extends Component {

    render() {
        return (
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed col-lg-2" style={{height: '100vh', boxShadow: '0px 0px 5px 1px #ccc'}}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <span className="fs-4">Массив-Юг</span>
                </a>
                <hr/>
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item">
                            <Link href='/'>
                                <a href="#" className="nav-link active" aria-current="page">
                                    Dashboard
                                </a>
                            </Link>

                        </li>
                        <li>
                            <Link href='/packages/1'>
                                <a href="#" className="nav-link link-dark">
                                    Журнал упаковки
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href='/orders/'>
                                <a href="#" className="nav-link link-dark">
                                    Журнал заказов
                                </a>
                            </Link>
                        </li>
                    </ul>
                    <hr/>
                        <div className="dropdown">
                            <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
                               id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="https://github.com/mdo.png" alt="" className="rounded-circle me-2" width="32" height="32"/>
                                    <strong>Админ</strong>
                            </a>
                            <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                                <li><a className="dropdown-item" href="#">Настройки</a></li>
                                <li><a className="dropdown-item" href="#">Профиль</a></li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li><a className="dropdown-item" href="#">Выйти</a></li>
                            </ul>
                        </div>
            </div>
        )
    }
}

