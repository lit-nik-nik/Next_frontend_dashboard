import {Modal} from "react-bootstrap";
import {Component} from "react";
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

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.error !== prevProps.error) {
            await this.setState({errorMessage: this.props.error.message})
            await this.setState({errorView: true})

            if (
                this.props.error.errors[0] === 'jwt expired' ||
                this.props.error.errors[0] === 'jwt must be provided' ||
                this.props.error.errors[0] === 'jwt malformed' ||
                this.props.error.errors[0] === "invalid signature"
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
                    size='lg'
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Body className='p-0 text-center m-5 error'>
                        <h3 className=''>{errorMessage}</h3>
                        <hr/>
                        <ul className='list-group'>
                            {this.props.error ?
                                this.props.error.errors.map((item, i) => {
                                    return (
                                        <li className='list-group-item list-group-item-danger mb-3' key={i}>{item}</li>
                                    )
                                })
                                : null}
                        </ul>

                    </Modal.Body>
                </Modal>
            </>
        )
    }
}