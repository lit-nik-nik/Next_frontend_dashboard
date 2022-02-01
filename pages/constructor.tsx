import MainLayout from "../components/layout/main";
import React, {ReactElement, useState} from "react";
import {MySelect} from "../components/elements/input";
import {Col, Row } from "react-bootstrap";
import Engine from "yug-entity-system";

const engine = new Engine()
const creator = engine.nomenclatureCreator();

const Constructor:React.FC<{token: string}> = ({token}) => {

    const [title, setTitle] = useState('Конструктор')

    return (
        <MainLayout title={title} link={'/constructor'} token={token}>
            <h1 className='text-center mt-2'>{title}</h1>

            <Row>
                <Col/>
                <Col lg={2}>
                    <FirstSelect/>
                </Col>
                <Col/>
            </Row>


        </MainLayout>
    )
}

const FirstSelect = () => {
    let optionJSX: Array<ReactElement> = []

    const [nomenklatura, setNomenklatura] = useState(null)

    const option: Array<{label: string, value: string}> = [{label: 'Объект', value: 'object'}, {label: 'Компонент', value: 'component'}]

    option.map((o, i) => {
        optionJSX.push(<option key={i} value={o.value}>{o.label}</option>)
    })


    return (
        <>
            <MySelect name='Выберие объект' onChange={(e) => setNomenklatura(e.target.value)} option={optionJSX}/>

            {nomenklatura && JSON.stringify(creator.newNomenclature(nomenklatura).build())}
        </>
    )
}

export default Constructor;