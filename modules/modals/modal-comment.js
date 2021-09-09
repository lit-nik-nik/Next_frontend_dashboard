import {Modal, Form} from "react-bootstrap";
import React from "react";

export default function ModalComment (props) {

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className='text-center d-block'>
                    {`Введите комментарий к заказу - ${props.orderChange.nameOrder}`}
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        ref={props.ref}
                        onBlur={() => props.ref.current.focus()}
                        value={props.orderChange.comment}
                        className='border rounded-0'
                        onChange={e => props.onChange(e.target.value)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') props.onKeyPress()
                        }}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}