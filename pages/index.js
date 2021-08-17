import { Col, Container, Row } from "react-bootstrap"
import { MainLyout } from '../components/layout/main'
import { useRouter } from 'next/router'
import Link from "next/link"


export default function Home() {
  const router = useRouter()

  return (
    <MainLyout>

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
