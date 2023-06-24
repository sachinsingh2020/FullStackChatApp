import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, useDisclosure, useToast, Badge } from '@chakra-ui/react';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";
import ProfileModal from '../ChatPage/ProfileModal';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, getUsers, logout } from '../../redux/actions/user';
import { accessChatFunction, fetchChatsFunction } from '../../redux/actions/chat';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../Others/ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { Spinner } from "@chakra-ui/spinner";
import NonRepeat from '../UserAvatar/NonRepeat';


const SideDrawer = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { loading, error, message, users, me } = useSelector(state => state.user);
    const { loading: chatLoading, error: chatError, chat, chats } = useSelector(state => state.chat);
    const { notification } = useSelector(state => state.message);

    const logoutHandler = async (e) => {
        e.preventDefault();

        await dispatch(logout());
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        await dispatch(getUsers(search));
    }

    const accessChat = async (e, userId) => {
        e.preventDefault();
        await dispatch(accessChatFunction(userId));
        await dispatch(fetchChatsFunction());
        if (chat && chat._id && !chats.find((c) => c._id === chat._id)) {
            dispatch({ type: 'updateChatArray', payload: chat });
        }
        onClose();
    }


    useEffect(() => {
        dispatch(getMe());
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
        if (message) {
            toast({
                title: message,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            dispatch({ type: 'clearMessage' });
            navigate('/');
        }
    }, [dispatch, error, message, toast, navigate, chatError]);


    if (!chats) return null;

    return (
        <>
            <Box display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <FaSearch />
                        <Text d={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Sachin Chat App
                </Text>
                <div style={{ display: "flex" }}>
                    <Menu>
                        <MenuButton p={1} display={'flex'}    >
                            <Badge ml="1" color={
                                notification.length && notification.length > 0 ? "darkred" : "black"
                            }  >
                                {notification.length}
                                <FaBell fontSize={'20px'} />
                            </Badge>
                            {/* <Badge count={notification.length} effect={["scale"]} /> */}
                        </MenuButton>
                        <MenuList pl={2}>
                            {
                                !notification.length && "No New Messages"
                            }
                            <NonRepeat notification={notification} />
                            {/* {
                                notification.map((notif) => (
                                    <MenuItem key={notif._id}
                                        onClick={selectChatHandler(notif.chat, notif)}
                                    >
                                        {
                                            notif.chat.isGroupChat ?
                                                `New Message in ${notif.chat.chatName}` :
                                                `New Message from ${getSender(me, notif.chat.users)}`
                                        }
                                    </MenuItem>
                                ))
                            } */}

                        </MenuList>

                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<FaChevronDown />}>
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={"sachin"}
                                src={
                                    me ? me.pic.url : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                                }
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler} >Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button isLoading={loading} onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            users && users?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={(e) => accessChat(e, user._id)}
                                />
                            ))
                        )}
                        {chatLoading && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
