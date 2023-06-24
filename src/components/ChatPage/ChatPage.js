import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import SideDrawer from '../miscellaneous/SideDrawer'
import MyChats from './MyChats';
import ChatBox from './ChatBox';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../redux/actions/user';

const ChatPage = () => {
    const dispatch = useDispatch();

    const { me } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    return (
        <div style={{ width: '100%' }} >
            {me && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {me && <MyChats />}
                {me && <ChatBox />}
            </Box>
        </div>
    )
}

export default ChatPage
