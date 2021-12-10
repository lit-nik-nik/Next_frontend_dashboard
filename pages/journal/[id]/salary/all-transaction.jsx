import React, {Component} from "react";
import {Card, Col, Row, Toast} from "react-bootstrap";
import Link from "next/link";
import {MainLayout} from "../../../../components/layout/main";
import {withRouter} from "next/router";
import {getTokenCookies} from "../../../../modules/cookie";
import {getTransactionSalary} from "../../../../services/journals/get";
import JournalLayout from "../../../../components/layout/journals";

class AllTransactionSalary extends Component {

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
        const {link, journalID, activeSalary} = this.state
        const {transactions} = this.props

        return (
            <MainLayout title={`Выплаченные транзакции`} link={link} token={this.props.token} error={this.props.error}>
                <JournalLayout
                    journalID={journalID}
                    activePage={'salary'}
                    activeSalary={activeSalary}
                >
                    <Row>
                        {transactions ? transactions.map((item, i) => {
                            return (
                                <Col lg={3} className='my-3 text-center' key={i}>
                                    {/*<Card className='shadow'>*/}
                                    {/*    <Card.Header*/}
                                    {/*        className='shadow-sm'*/}
                                    {/*    >*/}
                                    {/*        Транзакция № {item.ID} от {new Date(item.DATE_ADDED).toLocaleString().slice(0, 10)}*/}
                                    {/*    </Card.Header>*/}
                                    {/*    <Card.Body>*/}
                                    {/*        <Card.Title>{item.NAME}</Card.Title>*/}
                                    {/*        <Card.Text>*/}
                                    {/*            Выплачено - {item.MONEY} руб.*/}
                                    {/*        </Card.Text>*/}
                                    {/*        <Link href={`/transaction/${item.ID}`}>*/}
                                    {/*            <a className='btn btn-outline-light text-dark border shadow-sm w-100'>*/}
                                    {/*                Просмотреть*/}
                                    {/*            </a>*/}
                                    {/*        </Link>*/}
                                    {/*    </Card.Body>*/}
                                    {/*</Card>*/}

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
                </JournalLayout>
            </MainLayout>
        )
    }
}

export default withRouter(AllTransactionSalary)

export async function getServerSideProps({req,query}) {

    const token = getTokenCookies(req.headers.cookie)
    const id = query.id

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