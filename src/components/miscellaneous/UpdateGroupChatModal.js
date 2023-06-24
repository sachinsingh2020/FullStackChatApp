import { SpinnerIcon, ViewIcon } from '@chakra-ui/icons';
import { IconButton, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { fetchChatsFunction, groupAdd, groupRemove, groupRename } from '../../redux/actions/chat';
import { getUsers } from '../../redux/actions/user';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ name }) => {
    const toast = useToast();
    const dispatch = useDispatch();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat } = useSelector(state => state.chat);
    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState('');
    const { renameLoading, removeLoading, message, error } = useSelector(state => state.chat);
    const { users, loading, me } = useSelector(state => state.user);

    const leaveGroup = () => async (e) => {
        e.preventDefault();
        await dispatch(groupRemove(selectedChat._id, me._id));
        await dispatch(fetchChatsFunction());
        await dispatch({ type: 'updateSelectedChat', payload: null });
        onClose();
    }

    const handleRemove = (user) => async (e) => {
        e.preventDefault();

        if (selectedChat.groupAdmin._id !== me._id) {
            toast({
                title: "Only Admin can remove users from Group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        await dispatch(groupRemove(selectedChat._id, user._id));
        await dispatch(fetchChatsFunction());

    }

    const handleRename = (chatId, newName) => async (e) => {
        e.preventDefault();

        if (!newName) {
            toast({
                title: "Please Enter Name Here",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== me._id) {
            toast({
                title: "Only Admin can rename the group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        await dispatch(groupRename(chatId, newName));
        await dispatch(fetchChatsFunction());
        // onClose();

    }

    const handleSearch = async (e) => {
        setSearch(e.target.value);
        await dispatch(getUsers(search));
    }

    const handleAddUser = (user) => async (e) => {
        e.preventDefault();

        // console.log("selectedChat", selectedChat.groupAdmin);
        // console.log("user", user);
        // console.log("me", me);

        if (selectedChat.groupAdmin._id !== me._id) {
            toast({
                title: "Only Admin can add users",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        await dispatch(groupAdd(selectedChat._id, user._id));
        await dispatch(fetchChatsFunction());

    }
    // if (selectedChat) {
    //     console.log(selectedChat);
    // }

    // if (users) {
    //     console.log(users);
    // }

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
        if (message) {
            toast({
                title: message,
                status: "sucess",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            dispatch({ type: 'clearError' });
        }
    }, [dispatch, error, toast, message]);
    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <Text textAlign={'center'} fontWeight={'bold'}>
                        {`Group Admin - ${selectedChat.groupAdmin.name === me.name ? 'You' : selectedChat.groupAdmin.name}`}
                    </Text>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                (u._id === selectedChat.groupAdmin._id) ? null : (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        admin={selectedChat.groupAdmin}
                                        handleFunction={handleRemove(u)}
                                    />
                                )
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename(selectedChat._id, groupChatName)}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                value={search}
                                onChange={handleSearch}
                            />
                        </FormControl>

                        {loading ? (
                            <SpinnerIcon size="lg" />
                        ) : (
                            users?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isLoading={removeLoading}
                            onClick={leaveGroup()}
                            colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
