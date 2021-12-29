import { Col, Row } from "react-bootstrap"
import MainLayout from '../components/layout/main'
import {withRouter} from "next/router";
import {Component} from "react";

class AllPlans extends Component {

    state = {
        link: null,
    }

    componentDidMount() {
        this.setState({link: this.props.router.pathname})
    }

    render() {
        const {link} = this.state
        const {token} = this.props

        return (
            <MainLayout title='Журнал всех планов' link={link} token={token}>
                <Row>
                    <Col></Col>
                </Row>
            </MainLayout>
        )
    }
}

export default withRouter(AllPlans)

// export async function getServerSideProps({req, query}) {
//
//     const token = getTokenCookies(req.headers.cookie)
//     const id = query.id
//
//     return {
//         props: {
//             tokenProps: token
//         }
//     }
//
// }