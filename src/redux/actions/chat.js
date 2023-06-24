import { server } from '../store';
import axios from 'axios';

export const accessChatFunction = (userId) => async (dispatch) => {
    try {
        dispatch({ type: 'getAccessChatRequest' });
        const { data } = await axios.post(`${server}/access`, { userId }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'getAccessChatSuccess', payload: data });
    } catch (error) {
        dispatch({ type: 'getAccessChatFail', payload: error.response.data.message });
    }
}


export const fetchChatsFunction = () => async dispatch => {
    try {
        dispatch({ type: 'fetchChatsRequest' });
        const { data } = await axios.get(`${server}/access`, {
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'fetchChatsSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'fetchChatsFail', payload: error.response.data.message });
    }
}

export const createGroupChat = (groupChatName, selectedUsersStringify) => async dispatch => {
    try {
        console.log("sachin");
        dispatch({ type: 'createGroupChatRequest' });
        const { data } = await axios.post(`${server}/group`, {
            name: groupChatName,
            users: selectedUsersStringify,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'createGroupChatSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'createGroupChatFail', payload: error.response.data.message });
    }
}

export const groupRename = (chatId, newName) => async dispatch => {
    try {
        dispatch({ type: 'groupRenameRequest' });
        const { data } = await axios.put(`${server}/rename`, {
            chatId,
            newName,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'groupRenameSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'groupRenameFail', payload: error.response.data.message });
    }
}

export const groupAdd = (chatId, userId) => async dispatch => {
    try {
        dispatch({ type: 'groupAddRequest' });
        const { data } = await axios.put(`${server}/groupadd`, {
            chatId,
            userId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'groupAddSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'groupAddFail', payload: error.response.data.message });
    }
}

export const groupRemove = (chatId, userId) => async dispatch => {
    try {
        dispatch({ type: 'groupRemoveRequest' });
        const { data } = await axios.put(`${server}/groupremove`, {
            chatId,
            userId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'groupRemoveSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'groupRemoveFail', payload: error.response.data.message });
    }
}