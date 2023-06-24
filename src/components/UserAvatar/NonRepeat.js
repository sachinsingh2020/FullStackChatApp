import { MenuItem } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSender } from '../config/ChatLogics';

const NonRepeat = ({ notification }) => {
    const dispatch = useDispatch();

    const { me } = useSelector((state) => state.user);

    const selectChatHandler = (chat, notif) => (e) => {
        e.preventDefault();

        dispatch({ type: 'updateSelectedChat', payload: chat });

        dispatch({ type: 'filterNotification', payload: notif });
    };

    const uniqueKeys = Array.from(new Set(notification.map((notif) => notif._id)));

    return (
        <>
            {uniqueKeys.map((key) => {
                const notif = notification.find((item) => item._id === key);
                return (
                    <MenuItem key={key} onClick={selectChatHandler(notif.chat, notif)}>
                        {notif.chat.isGroupChat
                            ? `New Message in ${notif.chat.chatName}`
                            : `New Message from ${getSender(me, notif.chat.users)}`}
                    </MenuItem>
                );
            })}
        </>
    );
};

export default NonRepeat;
