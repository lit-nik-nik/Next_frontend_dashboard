import {Col, Row} from "react-bootstrap";

export default function Version() {
    return (
        <Row>
            <Col className='text-start text-muted mb-1' style={{fontSize: '10px', position: "absolute", bottom: '15px', right: 0, zIndex: 3333}}>
                version: 1.0.8
            </Col>
        </Row>
    )
}