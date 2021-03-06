import React, {Component} from "react";
import {Col, Row, Toast} from "react-bootstrap";
import Link from "next/link";
import MainLayout from "../../components/layout/main";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../modules/cookie";
import {getTransactionSalary} from "../../api/journals/get";

class BookkeepingAllTransaction extends Component {

    state = {
        activeSalary: 'all-transaction',
        link: null,
        journalID: null
    }

    async componentDidMount() {
        this.setState({link: this.props.router.asPath})
        this.setState({journalID: this.props.router.query.id})
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    render() {
        const {link} = this.state
        const {transactions} = this.props

        return (
            <MainLayout title={`Выплаченные транзакции`} link={link} token={this.props.token} error={this.props.error}>
                    <Row>
                        {transactions ? transactions.map((item, i) => {
                            return (
                                <Col lg={3} className='my-3 text-center' key={i}>
                                    <Toast>
                                        <Toast.Header closeButton={false}>
                                            <strong className="me-auto">Транзакция № {item.ID}</strong>
                                            <small className="text-muted">{new Date(item.DATE_ADDED).toLocaleString().slice(0, 10)}</small>
                                        </Toast.Header>
                                        <Toast.Body>
                                            <h5>{item.NAME}</h5>

                                            <div>
                                                Выплачено <strong>{item.MONEY} ₽</strong>
                                            </div>

                                            <hr/>

                                            <Link href={`/transaction/${item.ID}`}>
                                                <a className='btn btn-outline-light text-dark border shadow-sm w-100'>
                                                    Подробнее
                                                </a>
                                            </Link>
                                        </Toast.Body>
                                    </Toast>
                                </Col>
                            )
                        }) : null }
                    </Row>
            </MainLayout>
        )
    }
}

export default withRouter(BookkeepingAllTransaction)

export async function getServerSideProps({req}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = 5

    let transactions, error

    await getTransactionSalary(id, token)
        .then(res  => transactions = res.data.transactions)
        .catch(err => error = err.response?.data)


    if (transactions) {
        return {
            props: {
                transactions
            }
        }
    } else if (error) {
        return {
            props: {
                error
            }
        }
    } else {
        return {
            props: {}
        }
    }
}