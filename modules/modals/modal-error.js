import {Modal} from "react-bootstrap";

export default function ModalError (props) {

    return (
        <>
            <Modal
                {...props}
                size='sm'
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='p-0 text-danger text-center m-5'>
                    {props.error}
                </Modal.Body>
            </Modal>
        </>
    )
}