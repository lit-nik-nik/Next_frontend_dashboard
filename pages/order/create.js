import {MainLyout} from "../../components/layout/main";
import {getImageOrder} from "../../services/orders/get";
import Image from "next/image";

export default function CreateOrder ({image}) {


    return (
        <MainLyout>
            <h2 className='text-center fw-bold'>Создать заказ</h2>

            <img src={`data:image/jpeg;base64,${image}`}  alt='order-image'/>
        </MainLyout>
    )
}

export async function getServerSideProps() {
    return await getImageOrder();
}