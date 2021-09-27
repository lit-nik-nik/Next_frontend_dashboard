import {Col, Row, Spinner} from "react-bootstrap";

export default function Loading() {

    return (
        <Row>
            <Col className='text-center'>
                <Spinner animation="border" variant="warning" />
            </Col>
        </Row>
    )
}