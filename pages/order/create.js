import FormOrder from "../../modules/form-order"
import { useRouter } from 'next/router'
import { Button } from "react-bootstrap"



export default function CreateOrder() {

    const router = useRouter()

    const data = {
        BOX_COUNT: '',
        CITY: '',
        COMMENT: '',
        DATE_PACK: '',
        DELAY: '',
        ITM_ORDERNUM: '',
        ORDER_DEBT: '',
        ORDER_TOTAL_COST: '',
        STATUS_DESCRIPTION: '',
        PLAN_DATE: '',
        PACK_TYPE: '',
        TS: ''
    }

    return (
        <>
            <h1 className='text-center'>Добавление заказа</h1>
            <div className='text-center mb-3'>
                <Button variant='dark' onClick={() => router.back()}>
                    Вернуться назад
                </Button>
            </div>
            
            <FormOrder data={data} />

        </>
    )
}