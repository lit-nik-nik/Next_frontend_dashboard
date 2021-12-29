import {connect} from "react-redux";
import {Toast, ToastContainer, Col, Row, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import Image from 'next/image'
import {MyInput} from "../../components/elements/input";
import send from '../../public/send.png'
import success from '../../public/success.png'
import error from '../../public/error.png'
import {Comment, Chat} from '../../type-scrypt/types/journalsTypes'
import {postCommentOrder} from '../../services/journals/post'

const MyChat = (props:Chat) => {
    const {viewComments, comments, closeChat, user} = props

    const [comment, setComment] = useState('')
    const [dataId, setDataId] = useState(0)
    const [loading, setLoading] = useState(0)

    // формирования объекта комментария
    const sendComment = async () => {
        let data = {
            orderId: viewComments.orderId,
            dataId: dataId,
            text: comment
        }

        await sendForm(data)
    }

    // удаление комментария
    const removeComment = async (dataID: number) => {
        const data = {
            orderId: viewComments.orderId,
            dataId: dataID,
            text: ''
        }

        await sendForm(data)
    }

    // отправка формы на сервер
    const sendForm = async (data) => {
        setLoading(1)

        setComment('')
        setDataId(0)

        await postCommentOrder(data, props.token)
            .then(res => {
                if (res.status === 201 || res.status === 200) {
                    setLoading(2)

                    setTimeout(() => setLoading(0), 1000)

                    setTimeout(() => props.getComments(viewComments.orderId), 1000)
                }
            })
            .catch(err => {
                setLoading(-1)
                setTimeout(() => setLoading(0), 1000)
            })
    }

    return (
        <ToastContainer className={`p-3`} position='bottom-end' style={{maxHeight: '600px'}}>
            <Toast onClose={() => closeChat()}>
                <Toast.Header>
                    <strong className="me-auto text-dark" style={{fontSize: '12px'}}>Мини-чат ({viewComments.orderName})</strong>
                </Toast.Header>
                <Toast.Body style={{overflowY: 'auto', maxHeight: '450px'}}>
                    {comments.map((commentOrder:Comment, i) => (
                        <Toast
                            key={i}
                            bg={commentOrder.userName === user.userName ? 'success' : 'info'}
                            className={`mb-2 ${commentOrder.userName === user.userName ? 'ms-auto text-white' : 'me-auto'}`}
                            style={{width: '80%'}}
                        >
                            <Toast.Header className='py-1' closeButton={false}>
                                <strong className="me-auto" style={{fontSize: '12px'}}>{commentOrder.userName}: {commentOrder.sector}</strong>
                                {commentOrder.userName === user.userName || user.isOwner ? (
                                    <>
                                        <i
                                            className="bi bi-pencil-fill text-warning me-1"
                                            onClick={async () => {
                                                setComment(commentOrder.data)
                                                setDataId(commentOrder.id)
                                            }}
                                        />
                                        <i
                                            className="bi bi-trash2-fill text-danger"
                                            onClick={() => removeComment(commentOrder.id)}
                                        />
                                    </>
                                ) : null}
                            </Toast.Header>
                            <Toast.Body className="text-end py-1">
                                <i>{commentOrder.data}</i>
                            </Toast.Body>
                        </Toast>
                    ))}
                </Toast.Body>
                <hr className='my-1'/>
                <Row className='mx-1 mt-1 mb-2 align-items-end row'>
                    <Col lg={10}>
                        <MyInput
                            name={"Введите комментарий"}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            onKeyPress={() => sendComment()}
                        />
                    </Col>
                    <Col lg={2}>
                        {loading === 1 ?
                            <Spinner animation="border" variant="warning" />
                            : loading === 2 ?
                                <Image
                                    src={success}
                                />
                                    : loading === -1 ?
                                        <Image
                                            src={error}
                                        />
                                            : <Image
                                                src={send}
                                                onClick={() => sendComment(comment)}
                                            />
                        }

                    </Col>
                </Row>
            </Toast>
        </ToastContainer>

    )
}

const mapSTP = state => ({
    comments: state.journal.comments,
    user: state.app.user
})

export default connect(mapSTP, {})(MyChat)