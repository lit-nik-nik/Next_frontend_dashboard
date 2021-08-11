import {Col, Row} from "react-bootstrap"
import Link from "next/link"

const Header = (props) => {

    return (
        <>
            <Row className='bg-dark mb-3'>
                <Col>
                    <h1 className='text-left text-uppercase m-3' style={{fontSize: 16}}>
                        <Link href='/'>
                            <a className='text-white text-decoration-none'>
                                Система управления заказами | {props.title}
                            </a>
                        </Link>
                    </h1>
                </Col>
            </Row>
        </>
    )
}

export default Header;


