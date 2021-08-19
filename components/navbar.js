import {Component} from "react";
import Link from "next/link";

export default class Navbar extends Component {

    render() {
        return (
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed col-lg-2 border-end" style={{height: '95vh'}}>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link href='/'>
                            <a className="nav-link active" aria-current="page">
                                Dashboard
                            </a>
                        </Link>

                    </li>
                    <li>
                        <Link href='/packages/1'>
                            <a className="nav-link link-dark">
                                Журнал упаковки
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/orders/'>
                            <a className="nav-link link-dark">
                                Журнал заказов
                            </a>
                        </Link>
                    </li>
                    <hr/>
                    <li>
                        <Link href='/auth/'>
                            <a className="nav-link link-dark">
                                Авторизация
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}

