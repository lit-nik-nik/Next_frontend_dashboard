import { Container } from "react-bootstrap";
import Header from "../header";

export function MainLyout({children, title}) {

    return (
        <>
            <Header title={title} />

            <Container fluid>
                {children}
            </Container>
        </>
    )
}