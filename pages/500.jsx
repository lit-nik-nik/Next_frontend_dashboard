import {Row, Col} from "react-bootstrap";
import Link from "next/link";
import exitApp from "../modules/exit";

export default function Custom500() {

    exitApp()

    return (
        <>
            <Row style={{height: '100vh', width: '100%'}} className='bg-image-404'>
                <Col />
                <Col lg={4} className='shadow-lg rounded-3 bg-white' style={{marginTop: '35vh', marginBottom: '40vh'}}>
                    <div className='text-center m-5'>
                        <h1 className='text-uppercase text-danger'>Ошибка 500 - Server-side error occurred</h1>
                        <hr/>
                        <p className='text-muted'>Ошибка получения данных.</p>
                        <Link href={'/'}>
                            <a>
                                Вернитесь на главную
                            </a>
                        </Link>
                    </div>
                </Col>
                <Col />
            </Row>
        </>
    )
}