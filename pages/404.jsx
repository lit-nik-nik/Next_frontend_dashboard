import {Row, Col} from "react-bootstrap";
import Link from "next/link";

export default function Custom404() {
    return (
        <>
            <Row style={{height: '100vh', width: '100%'}} className='bg-image-404'>
                <Col />
                <Col lg={4} className='shadow-lg rounded-3 bg-white' style={{marginTop: '35vh', marginBottom: '40vh'}}>
                    <div className='text-center m-5'>
                        <h1 className='text-uppercase text-danger'>Ошибка 404</h1>
                        <hr/>
                        <p className='text-muted'>Данная страница канула в небытие.</p>
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