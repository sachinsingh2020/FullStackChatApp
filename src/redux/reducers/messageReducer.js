import { createAction, createReducer } from '@reduxjs/toolkit';


const sendMessageRequest = createAction('sendMessageRequest');
const sendMessageSuccess = createAction('sendMessageSuccess');
const sendMessageFail = createAction('sendMessageFail');
const allMessagesRequest = createAction('allMessagesRequest');
const allMessagesSuccess = createAction('allMessagesSuccess');
const allMessagesFail = createAction('allMessagesFail');
const clearError = createAction('clearError');
const clearMessage = createAction('clearMessage');

// local Reducers 
const mergeMessageArray = createAction('mergeMessageArray');
const updateNotification = createAction('updateNotification');
const filterNotification = createAction('filterNotification');

export const messageReducer = createReducer({
    messageArray: [],
    notification: [],
}, (builder) => {
    builder
        .addCase(sendMessageRequest, (state) => {
            state.loading = true;
        })
        .addCase(sendMessageSuccess, (state, action) => {
            state.loading = false;
            state.sendedMessage = action.payload.myMessage;
            state.messageArray = [...state.messageArray, action.payload.myMessage];
            // console.log(state.messageArray);
        })
        .addCase(sendMessageFail, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(allMessagesRequest, (state) => {
            state.loading = true;
        })
        .addCase(allMessagesSuccess, (state, action) => {
            state.loading = false;
            state.allMessages = action.payload.myAllMessages;
            state.messageArray = action.payload.myAllMessages;
            // console.log(state.messageArray);
        })
        .addCase(allMessagesFail, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // .addCase(updateMessageArray, (state, action) => {
        //     state.messageArray = action.payload;
        //     console.log(action.payload);
        // })
        .addCase(mergeMessageArray, (state, action) => {
            console.log("actrion", action.payload);
            state.messageArray = [...state.messageArray, action.payload];
        })
        .addCase(updateNotification, (state, action) => {
            const existingIds = state.notification.map((item) => item._id);

            if (!existingIds.includes(action.payload._id)) {
                state.notification = [action.payload, ...state.notification];
            }
        })
        .addCase(filterNotification, (state, action) => {
            // console.log("notification", state.notification);
            // console.log("payload", action.payload);
            state.notification = state.notification.filter((item) => item._id !== action.payload._id && item.sender._id !== action.payload.sender._id);
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
        .addCase(clearMessage, (state) => {
            state.message = null;
        });
}
);