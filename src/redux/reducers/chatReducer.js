import { createAction, createReducer } from '@reduxjs/toolkit';

const getAccessChatRequest = createAction('getAccessChatRequest');
const getAccessChatSuccess = createAction('getAccessChatSuccess');
const getAccessChatFail = createAction('getAccessChatFail');
const fetchChatsRequest = createAction('fetchChatsRequest');
const fetchChatsSuccess = createAction('fetchChatsSuccess');
const fetchChatsFail = createAction('fetchChatsFail');
const createGroupChatRequest = createAction('createGroupChatRequest');
const createGroupChatSuccess = createAction('createGroupChatSuccess');
const createGroupChatFail = createAction('createGroupChatFail');
const groupRenameRequest = createAction('groupRenameRequest');
const groupRenameSuccess = createAction('groupRenameSuccess');
const groupRenameFail = createAction('groupRenameFail');
const groupAddRequest = createAction('groupAddRequest');
const groupAddSuccess = createAction('groupAddSuccess');
const groupAddFail = createAction('groupAddFail');
const groupRemoveRequest = createAction('groupRemoveRequest');
const groupRemoveSuccess = createAction('groupRemoveSuccess');
const groupRemoveFail = createAction('groupRemoveFail');
const clearError = createAction('clearError');
const clearMessage = createAction('clearMessage');

// local reducers 
const updateChatArray = createAction('updateChatArray');
const updateSelectedChat = createAction('updateSelectedChat');

export const chatReducer = createReducer({
    chats: [],
    chat: "",
    selectedChat: null,
}, (builder) => {
    builder
        .addCase(getAccessChatRequest, (state) => {
            state.loading = true;
        })
        .addCase(getAccessChatSuccess, (state, action) => {
            state.loading = false;
            state.chat = action.payload;
            // console.log("accessCaht", state.chat);
        })
        .addCase(getAccessChatFail, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchChatsRequest, (state) => {
            state.loading = true;
        })
        .addCase(fetchChatsSuccess, (state, action) => {
            state.loading = false;
            state.chats = action.payload.results.reverse();
        })
        .addCase(fetchChatsFail, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createGroupChatRequest, (state) => {
            state.loading = true;
        })
        .addCase(createGroupChatSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.group = action.payload.fullGroupChat;
        })
        .addCase(createGroupChatFail, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(groupRenameRequest, (state) => {
            state.renameLoading = true;
        })
        .addCase(groupRenameSuccess, (state, action) => {
            state.renameLoading = false;
            state.message = action.payload.message;
            state.selectedChat = action.payload.updatedChat;
        })
        .addCase(groupRenameFail, (state, action) => {
            state.renameLoading = false;
            state.error = action.payload;
        })
        .addCase(groupAddRequest, (state) => {
            state.addLoading = true;
        })
        .addCase(groupAddSuccess, (state, action) => {
            state.addLoading = false;
            state.message = action.payload.message;
            state.selectedChat = action.payload.addToGroup;
        })
        .addCase(groupAddFail, (state, action) => {
            state.addLoading = false;
            state.error = action.payload;
        })
        .addCase(groupRemoveRequest, (state) => {
            state.removeLoading = true;
        })
        .addCase(groupRemoveSuccess, (state, action) => {
            state.removeLoading = false;
            state.message = action.payload.message;
            state.selectedChat = action.payload.removeFromGroup;
        })
        .addCase(groupRemoveFail, (state, action) => {
            state.removeLoading = false;
            state.error = action.payload;
        })
        .addCase(updateChatArray, (state, action) => {
            state.chats = [action.payload, ...state.chats];
        })
        .addCase(updateSelectedChat, (state, action) => {
            console.log("update select chat1", state.selectedChat);
            state.selectedChat = action.payload;
            console.log("update select chat2", state.selectedChat);
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
        .addCase(clearMessage, (state) => {
            state.message = null;
        })
});