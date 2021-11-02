import {Col, Row} from "react-bootstrap";

export default function Version() {
    return (
        <Row>
            <Col className='text-start text-muted mb-1' style={{fontSize: '10px', position: "absolute", bottom: 0, right: 0, zIndex: 3333}}>
                version: 1.0.6
            </Col>
        </Row>
    )
}