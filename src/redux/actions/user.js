import { server } from '../store';
import axios from 'axios';

export const register = (formdata) => async dispatch => {
    try {
        dispatch({ type: 'registerRequest' });
        const { data } = await axios.post(`${server}/register`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'registerSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'registerFail', payload: error.response.data.message });
    }
}

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: 'loginRequest' });

        const { data } = await axios.post(`${server}/login`, { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        dispatch({ type: 'loginSuccess', payload: data });
    }
    catch (error) {
        dispatch({ type: 'loginFail', payload: error.response.data.message });
    }
}

export const logout = () => async dispatch => {
    try {
        dispatch({ type: 'logoutRequest' });
        const { data } = await axios.get(`${server}/logout`, {
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'logoutSuccess', payload: data.message });
    } catch (error) {
        dispatch({ type: 'logoutFail', payload: error.response.data.message });
    }
};

export const getUsers = (search = "") => async dispatch => {
    try {
        dispatch({ type: 'getUsersRequest' });
        const { data } = await axios.get(`${server}/getusers?keyword=${search}`, {
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'getUsersSuccess', payload: data.users });
    } catch (error) {
        dispatch({ type: 'getUsersFail', payload: error.response.data.message });
    }
}

export const getMe = () => async dispatch => {
    try {
        dispatch({ type: 'getMeRequest' });
        const { data } = await axios.get(`${server}/me`, {
            withCredentials: true,
        });
        // console.log(data);
        dispatch({ type: 'getMeSuccess', payload: data.user });
    } catch (error) {
        dispatch({ type: 'getMeFail', payload: error.response.data.message });
    }
}
