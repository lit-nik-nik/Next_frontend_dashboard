import React from "react";
import {useRouter} from "next/router";
import {NologinLayout} from "../components/layout/nologin";
import ComAccTransOrder from "../components/at-order/com-at-order";

const AccTransOrder:React.FC = () => {
    const router = useRouter()

    return (
        <NologinLayout
            title='Форма приема-передачи заказа'
            link={router.pathname}
        >
            <div className='m-3'>
                <ComAccTransOrder />
            </div>

        </NologinLayout>
    )
}

export default AccTransOrder
