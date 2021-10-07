import {Button, Form, Modal, Row, Col, Alert} from "react-bootstrap";
import React, {useState} from "react";
import {pathToRegexp} from "next/dist/next-server/lib/router/utils/path-match";

export default function ModalBookkeeping (props) {

    const [penalty, setPenalty] = useState('');
    const [comment, setComment] = useState('');
    const [user, setUser] = useState('');
    const [cost, setCost] = useState(0);
    const [modif, setModif] = useState(0);

    const clearState = () => {
        setPenalty('')
        setComment('')
        setUser('')
        setCost(0)
        setModif(0)
    }

    return (
        <>
            <Modal
                {...props}
                dialogClassName={props.data[0] ? 'modal-width-60': 'modal-width-30'}
                aria-labelledby="contained-modal-title-vcenter"
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <h2 className='fw-bold w-100 text-center'>{props.message ? `${props.message}` : null}</h2>
                </Modal.Header>
                <Modal.Body className='p-0 text-center m-3'>
                    <Row>
                        <Col>
                            {props.otherTransactoins ? (
                                <>
                                    <Alert variant='secondary' className='m-0 p-1'>Доплаты / Удержания</Alert>
                                    <Form.Select
                                        className='mb-2'
                                        value={penalty}
                                        onChange={(e) => {
                                            props.otherTransactoins.values.map(value => {
                                                if (e.target.value === value.description) {
                                                    setModif(value.modifer)
                                                }
                                            })
                                            setPenalty(e.target.value)
                                        }}
                                    >
                                        <option value=''/>
                                        {props.otherTransactoins.values.map((value, i) => {
                                            return <option key={i} value={value.description}>{value.description}</option>
                                        })}
                                    </Form.Select>

                                    <Alert variant='secondary' className='m-0 p-1'>Комментарий:</Alert>
                                    <Form.Control
                                        className='mb-2'
                                        as='textarea'
                                        placeholder='Комментарий (необязательно)'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />

                                    <Alert variant='secondary' className='m-0 p-1'>Работник</Alert>
                                    <Form.Select className='mb-2' value={user} onChange={(e) => setUser(e.target.value)}>
                                        <option value=''/>
                                        {props.otherTransactoins.users.map((user, i) => {
                                            return <option key={i} value={user}>{user}</option>
                                        })}
                                    </Form.Select>

                                    <Alert variant='secondary' className='m-0 p-1'>Сумма</Alert>
                                    <Form.Control
                                        type='number'
                                        className='mb-2'
                                        placeholder='Сумма'
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                    />

                                    <Button
                                        variant='secondary'
                                        className='w-100'
                                        onClick={async () => {
                                            let newData
                                            let itemData = {
                                                userName: user,
                                                description: penalty,
                                                comment: comment,
                                                amount: +cost,
                                                modifer: modif
                                            }

                                            newData = [...props.data, itemData]

                                            await props.addPenaltyPrem(newData)
                                            clearState()
                                        }}
                                    >
                                        Добавить
                                    </Button>
                                </>
                            ) : null}
                        </Col>
                        {props.data ? props.data.map((item, i) => {
                            return (
                                <Col lg={7}>
                                    <Row className='border mb-1' key={i}>
                                        <Col>
                                            <Alert
                                                variant='light'
                                                className='m-0 py-2 px-1'
                                            >
                                                {item.userName} - {item.description}{item.comment ? ` (${item.comment})` : null}:  {item.amount * item.modifer} Руб.

                                            </Alert>
                                        </Col>
                                        <Col lg={2} className='text-end m-0 me-3 py-2 px-1'>
                                            <i
                                                className="bi bi-x-octagon text-danger"
                                                onClick={async () => {
                                                    let newData = [...props.data.slice(0, i), ...props.data.slice(i + 1)]
                                                    await props.addPenaltyPrem(newData)
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            )
                        }) : null}
                    </Row>

                    <Button
                        variant='success'
                        className='w-100 mt-3'
                        onClick={() => {
                            clearState()
                            props.onHide()
                        }}
                    >
                        Сохранить
                    </Button>

                </Modal.Body>
            </Modal>
        </>
    )
}