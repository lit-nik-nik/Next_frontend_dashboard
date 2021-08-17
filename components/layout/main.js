import { Container, Col, Row } from "react-bootstrap";
import Header from "../header";
import Navbar from "../navbar";

export function MainLyout({children, title}) {

    return (
        <>
            <Row>
                <Col sm={2} className='pe-0'>
                    <Navbar/>
                </Col>
                <Col className='ps-0'>
                    <Header title={title} />

                    <Container fluid>
                        {children}
                    </Container>
                </Col>
            </Row>
        </>
    )
}