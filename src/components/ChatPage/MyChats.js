import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../redux/actions/user';
import { fetchChatsFunction } from '../../redux/actions/chat';
import { GrAdd } from "react-icons/gr";
import ChatLoading from '../Others/ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from '../miscellaneous/GroupChatModal';


const MyChats = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { chats, error, selectedChat } = useSelector(state => state.chat);
  const { me } = useSelector(state => state.user);

  const fetchChats = useCallback(async () => {
    await dispatch(fetchChatsFunction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMe());
    fetchChats();
    if (error) {
      toast({
        title: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      dispatch({ type: 'clearError' });
    }

  }, [dispatch, fetchChats, error, toast])


  // console.log(me);
  // if (!me ) return null;

  const selectChatHandler = (chat) => (e) => {
    e.preventDefault();
    
    dispatch({ type: 'updateSelectedChat', payload: chat })
  }
  return (
    <>
      {chats && chats.length > 0 ? (
        <Box
          display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
          flexDir="column"
          alignItems="center"
          p={3}
          bg="white"
          w={{ base: "100%", md: "31%" }}
          borderRadius="lg"
          borderWidth="1px"
        >
          <Box
            pb={3}
            px={3}
            fontSize={{ base: "28px", md: "20px" }}
            fontFamily="Work sans"
            display="flex"
            w="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            My Chats
            <GroupChatModal>
              <Button
                display="flex"
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                rightIcon={<GrAdd />}
              >
                New Group Chat
              </Button>
            </GroupChatModal>
          </Box>
          <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {chats ? (
              <Stack overflowY="scroll">
                {chats && chats.map((chat) => (
                  <Box
                    onClick={selectChatHandler(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(me, chat.users)
                        : chat.chatName}
                    </Text>
                    {/* {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )} */}
                  </Box>
                ))}
              </Stack>
            ) : (
              <ChatLoading />
            )}
          </Box>
        </Box>
      ) : null}
    </>
  )
}

export default MyChats
