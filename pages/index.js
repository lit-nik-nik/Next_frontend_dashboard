import { Col, Container, Row, Button } from "react-bootstrap"
import { MainLyout } from '../components/layout/main'
import {withRouter} from "next/router";
import {Bar} from 'react-chartjs-2';
import {Component} from "react";

class Home extends Component {

    state = {
        link: null,
        data: {
            labels: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь"
            ],
            datasets: [{
                label: 'Заказы по месяца',
                data: [50, 40, 30, 25, 35, 45, 36, 45, 15],
                backgroundColor: [
                    'rgba(0,85,255,0.2)',
                    'rgba(0,166,255,0.2)',
                    'rgba(0,255,142,0.2)',
                    'rgba(0,255,22,0.2)',
                    'rgba(15,219,0,0.2)',
                    'rgba(0,146,15,0.2)',
                    'rgba(55,160,0,0.2)',
                    'rgba(76,121,0,0.2)',
                    'rgba(161,133,0,0.2)',
                    'rgba(212,171,0,0.2)',
                    'rgba(226,104,0,0.2)',
                    'rgba(86,0,255,0.2)'
                ],
                borderColor: [
                    'rgb(0,85,255)',
                    'rgb(0,166,255)',
                    'rgb(0,255,142)',
                    'rgb(0,255,22)',
                    'rgb(15,219,0)',
                    'rgb(0,146,15)',
                    'rgb(55,160,0)',
                    'rgb(76,121,0)',
                    'rgb(161,133,0)',
                    'rgb(212,171,0)',
                    'rgb(226,104,0)',
                    'rgb(86,0,255)'
                ],
                borderWidth: 1
            }]
        },
        params: `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`
    }

    componentDidMount() {
        this.setState({link: this.props.router.pathname})
    }

    openPopup = () => {
        open('http://192.168.42.11:3000/', 'test', this.state.params);
    }

    render() {
        const {link, data} = this.state

        return (
            <MainLyout title='Панель управления' link={link}>
                <Container fluid>
                    <Row className='mb-3 text-center'>
                        <Col lg={12}>
                            <h2>Панель управления</h2>
                            <hr/>
                        </Col>

                        <Col lg={3}>
                            <Bar data={data} width={300} height={300} className='p-4 shadow rounded m-2'/>
                        </Col>
                        <Col lg={6}>
                            <div className='shadow rounded m-2'>
                                <Button
                                    type='button'
                                    onClick={() => this.openPopup()}
                                >Open Popup</Button>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className='shadow rounded m-2'>
                                3
                            </div>
                        </Col>
                    </Row>
                </Container>
            </MainLyout>
        )
    }
}

export default withRouter(Home)