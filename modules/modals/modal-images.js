import {Modal} from "react-bootstrap";

export default function ModalImage (props) {

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                contentClassName='bg-transparent border-0'
            >
                <Modal.Body className='p-0'>
                    <img
                        src={`data:image/jpeg;base64,${props.data}`}
                        alt="test"
                        width={'85%'}
                        className='rounded-3 shadow'
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}