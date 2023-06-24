import { Box } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux';
import SingleChat from '../UserAvatar/SingleChat';

const ChatBox = () => {

    const { selectedChat } = useSelector(state => state.chat);

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat />
        </Box>
    )
}

export default ChatBox
