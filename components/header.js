import {Col, Row} from "react-bootstrap"
import Link from "next/link"

const Header = (props) => {

    return (
        <>
            <div className='bg-light p-3 mb-3 sticky-top' style={{boxShadow: '5px 0px 5px 1px #ccc'}}>
                <h1 className='text-end text-uppercase mb-0' style={{fontSize: 16}}>
                    <Link href='/'>
                        <a className='text-dark text-decoration-none'>
                            Система управления заказами | {props.title}
                        </a>
                    </Link>
                </h1>
            </div>
        </>
    )
}

export default Header;


