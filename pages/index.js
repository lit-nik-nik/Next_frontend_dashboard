import { Col, Container, Row } from "react-bootstrap"
import { MainLyout } from '../components/layout/main'
import {useRouter} from "next/router";

export default function Home() {

    const link = useRouter().pathname

    return (
        <MainLyout title='Панель управления' link={link}>
            <Container fluid>
                <Row className='mb-3'>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Container>
        </MainLyout>
    )
}