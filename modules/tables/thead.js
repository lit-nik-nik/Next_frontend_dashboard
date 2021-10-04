import {Form} from "react-bootstrap";

export default function Thead ({title}) {

    const tableHead = title.map((name, index) => 
        <th key={index}>
            {name}
        </th>
    )

    return (
        <thead className='align-middle text-center'>
            <tr>
                {tableHead}
            </tr>
        </thead>
    )
}
