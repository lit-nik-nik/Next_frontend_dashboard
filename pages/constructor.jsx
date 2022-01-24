import MainLayout from "../components/layout/main";
import React from "react";


export default function Constructor (props) {

    return (
        <MainLayout title={'Конструктор'} link={'/constructor'} token={props.token}>
            <h1 className='text-center'>Конструктор Объектов</h1>
        </MainLayout>
    )

}