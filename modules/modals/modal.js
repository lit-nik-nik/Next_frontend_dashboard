import {Button, Modal} from "react-bootstrap";

export default function ModalWindow (props) {

    let orders = props.orders ? props.orders : []

    const ordersDescription = orders.map((order, i) => {
        return (
            <div className={`${order.completed ? 'text-success' : 'text-danger'}`} key={i}>
                Заказ № {order.idOrder} {order.completed ? 'принят -' : 'не принят. Причина:'} {order.description}
            </div>
        )
    })

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='p-0 text-center m-5'>
                    <h2 className='fw-bold'>{props.message ? `${props.message}` : null}</h2>
                    <hr/>
                    {orders[0] ? ordersDescription : null}

                    {props.clearData ? (
                        <Button
                            variant='warning'
                            className='my-3'
                            onClick={() => props.clearData()}
                        >
                            Со списком принятых и непринятых заказов ознакомлен(а)
                        </Button>
                    ) : null}
                </Modal.Body>
            </Modal>
        </>
    )
}