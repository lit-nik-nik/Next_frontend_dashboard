import { Container, Col, Row } from "react-bootstrap";
import Header from "../header";
import Navbar from "../navbar";

export function MainLyout({children, title}) {

    return (
        <>
            <Header />

            <Container fluid className='p-0'>
                <Row>
                    <Col lg={2}>
                        <Navbar/>
                    </Col>
                    <Col lg={10} className='py-3 px-4'>
                        {children}
                    </Col>
                </Row>
            </Container>
        </>
    )
}