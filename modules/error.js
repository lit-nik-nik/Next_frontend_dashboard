import {Modal} from "react-bootstrap";
import {Component} from "react";
import Error from "next/error";
import exitApp from "./exit";

export default class CustomError extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        errorView: false,
        errorMessage: null
    }

    async componentDidMount() {
        if (this.props.error) {
            await this.setState({errorMessage: this.props.error.message})
            await this.setState({errorView: true})

            if (
                this.props.error.errors[0] === 'jwt expired' ||
                this.props.error.errors[0] === 'jwt must be provided' ||
                this.props.error.errors[0] === 'jwt malformed'
            ) exitApp()
        }
    }

    render() {
        const {errorMessage, errorView} = this.state

        return (
            <>
                <Modal
                    show={errorView}
                    onHide={() => this.setState({errorView: false})}
                    size='sm'
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Body className='p-0 text-danger text-center m-5 error'>
                        {errorMessage}
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}