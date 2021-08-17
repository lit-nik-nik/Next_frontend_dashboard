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
                <Link href='/packages/1'>
                    <a className='btn btn-dark w-100 text-uppercase' style={{height: 100, paddingTop: 30, fontSize: 24}}>
                      Журнал упаковки
                    </a>
                </Link>
            </Col>
            <Col>
                <Link href='/orders/'>
                    <a className='btn btn-dark w-100 text-uppercase' style={{height: 100, paddingTop: 30, fontSize: 24}}>
                        Журнал заказов
                    </a>
                </Link>
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
