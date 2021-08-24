import {Modal} from "react-bootstrap";

export default function ModalWindow (props) {

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className='p-0'>
                    <img
                        src={`data:image/jpeg;base64,${props.data}`}
                        alt="test"
                        width={800}
                        className='rounded-3 shadow'
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}