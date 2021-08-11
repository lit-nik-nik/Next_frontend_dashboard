import { Form, Row, Col, Button } from "react-bootstrap"
import { changeDate } from "./change-data";


export default function FormOrder (props) {

    const {
        BOX_COUNT,
        CITY,
        COMMENT,
        DATE_PACK,
        DELAY,
        ITM_ORDERNUM,
        ORDER_DEBT,
        ORDER_TOTAL_COST,
        STATUS_DESCRIPTION,
        PLAN_DATE,
        PACK_TYPE,
        TS,
    } = props.data
    
    const formGroup = (id, type, name, value = '') => {
        if (id === 'orderDelay') {
            let bgColor;

            if (value > 0) bgColor = 'bg-danger'
            else if (value < 0 ) bgColor = 'bg-success'
            else if (value === 0) bgColor = 'bg-warning'

            return (
                <Form.Group as={Col} controlId={id} className='text-center'>
                    <Form.Label className='text-secondary'>{name}</Form.Label>
                    <Form.Control size='sm' type={type} placeholder={name} value={value} className={`text-center ${bgColor}`} disabled/>
                </Form.Group>
            )
        } else {
            return (
                <Form.Group as={Col} controlId={id} className='text-center'>
                    <Form.Label className='text-secondary'>{name}</Form.Label>
                    <Form.Control size='sm' type={type} placeholder={name} value={value} className='text-center'/>
                </Form.Group>
            )
        }
}

    return (
        <Form>
            <Row className='mb-3'>
                {formGroup('orderName', 'text', 'Наименование заказа', ITM_ORDERNUM)}
                {formGroup('orderStatus', 'text', 'Статус заказа', STATUS_DESCRIPTION)}
                {formGroup('orderCost', 'text', 'Стоимость заказа', ORDER_TOTAL_COST)}
                {formGroup('orderDebt', 'text', 'Долг по заказу', ORDER_DEBT)}
            </Row>
            <Row className='mb-3'>
                {formGroup('orderPlan', 'date', 'Дата выполнения', changeDate(PLAN_DATE, 'YYYY-MM-DD'))}
                {formGroup('orderDelay', 'text', 'Срок опоздания заказа', DELAY)}
                {formGroup('orderComment', 'text', 'Примечание', COMMENT)}
                {formGroup('orderTS', 'date', 'TS', changeDate(TS, 'YYYY-MM-DD'))}
            </Row>
            <Row className='mb-3'>
                {formGroup('orderDatePack', 'date', 'Дата упаковки', changeDate(DATE_PACK, 'YYYY-MM-DD'))}
                {formGroup('orderBox', 'text', 'Кол-во упаковок', BOX_COUNT)}
                {formGroup('orderStatusPack', 'text', 'Статус упаковки', PACK_TYPE)}
                {formGroup('orderCity', 'text', 'Город доставки', CITY)}
            </Row>

            <Button variant="success" type="submit" className='w-100'>
                Сохранить
            </Button>
        </Form>
    )
}