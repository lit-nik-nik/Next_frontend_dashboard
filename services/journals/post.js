import {connectAxios, myAxios, myOptions} from "../settings";
import {setCommentsOrder} from "../../redux/actions/actionsJournals";

export const postCommentOrder = async (data, token) => {
    return await myAxios.post(`/api/extra-data/comments/add`, data, myOptions(token))
}

export const connectCommentsOrder = async (data, token) => {
    const response =  await connectAxios.post(`/api/extra-data/comments/connect`, data, myOptions(token))

    if (response.status === 502) {
        await connectCommentsOrder(data, token);
    } else if (response.status !== 200) {

        console.log(response)

        await new Promise(resolve => setTimeout(resolve, 1000));
        await connectCommentsOrder(data, token);
    } else {
        await connectCommentsOrder(data, token);

        console.log(response.data)

    }
}