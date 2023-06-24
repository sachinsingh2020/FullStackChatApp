import { server } from '../store';
import axios from 'axios';

export const sendMessageFunction = (content, chatId) => async (dispatch) => {
    try {
        // console.log("sachin");
        dispatch({ type: 'sendMessageRequest' });
        const { data } = await axios.post(`${server}/send`, {
            content,
            chatId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'sendMessageSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'sendMessageFail', payload: error.response.data.message });
    }
}

export const allMessagesFunction = (chatId) => async (dispatch) => {
    try {
        dispatch({ type: 'allMessagesRequest' });
        const { data } = await axios.get(`${server}/allmsg/${chatId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'allMessagesSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'allMessagesFail', payload: error.response.data.message });
    }
}