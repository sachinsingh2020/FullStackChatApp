import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, IconButton, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import { FormControl, Input } from "@chakra-ui/react"
import { allMessagesFunction, sendMessageFunction } from '../../redux/actions/message';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import { fetchChatsFunction } from '../../redux/actions/chat';


const EndPoint = "http://localhost:4000";
let socket, selectedChatCompare;

const SingleChat = () => {
    const dispatch = useDispatch();
    const toast = useToast();

    const [newMessage, setNewMessage] = useState('');
    // eslint-disable-next-line
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { selectedChat, error: chatError } = useSelector(state => state.chat);
    const { me } = useSelector(state => state.user);
    const { loading, sendedMessage, error, messageArray, notification } = useSelector(state => state.message);

    useEffect(() => {
        socket = io(EndPoint);
        if (!me) return
        socket.emit("setup", me);

        socket.on("connected", () => setSocketConnected(true));

        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
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
        if (chatError) {
            toast({
                title: chatError,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            dispatch({ type: 'clearError' });
        }
    }, [dispatch, error, toast, chatError]);



    const handleRevokeSelectedChat = () => {
        dispatch({ type: 'updateSelectedChat', payload: null })
    }

    useEffect(() => {
        if (sendedMessage)
            socket.emit("new message", sendedMessage);
    }, [sendedMessage]);

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            await dispatch(sendMessageFunction(newMessage, selectedChat._id));
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;
        await dispatch(allMessagesFunction(selectedChat._id));

        socket.emit("join chat", selectedChat._id);
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        const handleMessageReceived = async (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                const senderId = newMessageReceived.sender._id;
                const isNotificationExist = notification.some((notificationItem) => notificationItem.sender._id === senderId);

                if (!isNotificationExist) {
                    dispatch({ type: 'updateNotification', payload: newMessageReceived });
                    await dispatch(fetchChatsFunction());
                }
            } else {
                if (!messageArray.some((msg) => msg._id === newMessageReceived._id)) {
                    dispatch({ type: 'mergeMessageArray', payload: newMessageReceived });
                }
            }
        };

        socket.on('message received', handleMessageReceived);

        return () => {
            socket.off('message received', handleMessageReceived);
        };
    }, [messageArray, notification]);




    // if (notification) {
    //     console.log("notification", notification);
    // }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={handleRevokeSelectedChat}
                        />
                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    {
                                        getSenderFull(me, selectedChat.users).name
                                    }
                                </>
                            ) :
                                (<>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal />
                                </>)
                        }
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messageArray} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {isTyping ? (
                                <div>
                                    <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_sjcbakkb.json" background="transparent" speed="1"
                                        style={{ width: "100px", height: "100px" }}
                                        autoplay></lottie-player>
                                    {/* <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    /> */}
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <>
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                </>
            )}
        </>
    )
}

export default SingleChat
