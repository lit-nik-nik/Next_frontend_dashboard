import {Button, Col, Row,} from "react-bootstrap"
import MainLayout from '../components/layout/main'
import {withRouter} from "next/router";
import {Bar} from 'react-chartjs-2';
import {Component} from "react";
import {connect} from 'react-redux';
import {setLoading, removeLoading} from "../redux/actions/actionsApp";

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
        const {token} = this.props

        return (
            <MainLayout title='Панель управления' link={link} token={token}>
                <Row className='my-3 text-center'>
                    <Col lg={12}>
                        <h2>Панель управления</h2>
                        <hr/>
                    </Col>

                    <Col lg={4}>

                    </Col>
                    <Col lg={4}>
                        <Bar data={data} width={300} height={300} className='p-4 shadow rounded m-2'/>
                    </Col>
                    <Col lg={4}>
                    </Col>
                </Row>
            </MainLayout>
        )
    }
}

export default connect(null, {loading: setLoading, unloading: removeLoading})(withRouter(Home))