import MainLayout from '../components/layout/main'
import React from "react";
import {useRouter} from "next/router";
import ComAccTransOrder from "../components/at-order/com-at-order";

const AccTransOrder:React.FC<{token: string}> = ({token}) => {
    const router = useRouter()

    return (
        <MainLayout
            title='Форма приема-передачи заказа'
            link={router.pathname}
            token={token}
        >

            <ComAccTransOrder />

        </MainLayout>
    )
}

export default AccTransOrder