import {Spinner} from "react-bootstrap";
import {connect} from "react-redux";


function Loading(props) {

    return (
        props.loading ?
        <>
            <div className='modal-backdrop show' style={{zIndex: 8}}/>
            <div className='position-absolute top-50 end-40' style={{zIndex: 1060}}>
                <Spinner animation="grow" size='lg' variant="warning" style={{width: '150px', height: '150px'}}/>
            </div>
        </>
        : null
    )
}

const mapSTP = state => {
    return {
        loading: state.app.loading
    }
}

export default connect(mapSTP)(Loading)