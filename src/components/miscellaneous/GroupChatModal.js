import { ModalFooter, useDisclosure, useToast } from '@chakra-ui/react';
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/actions/user';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { createGroupChat, fetchChatsFunction } from '../../redux/actions/chat';

const GroupChatModal = ({ children }) => {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const toast = useToast();

    const { loading, error, users } = useSelector(state => state.user);
    const { loading: createGroupLoading, message, error: createGroupError } = useSelector(state => state.chat);

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
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            dispatch({ type: 'clearMessage' });

        }
        if (createGroupError) {
            toast({
                title: createGroupError,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            dispatch({ type: 'clearError' });

        }

    }, [dispatch, error, toast, message, createGroupError])

    const handleSubmit = async (e) => {
        if (!groupChatName) {
            toast({
                title: "Please Enter a Group Name",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if (!selectedUsers) {
            toast({
                title: "Please Select atleast two user",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        const selectedUsersStringify = JSON.stringify(selectedUsers.map((u) => u._id));
        await dispatch(createGroupChat(groupChatName, selectedUsersStringify));
        await dispatch(fetchChatsFunction());
        onClose();
    }

    const handleSearch = async (e) => {
        setSearch(e.target.value);
        await dispatch(getUsers(search));
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        setSelectedUsers([userToAdd, ...selectedUsers,]);
        // console.log(selectedUsers);
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
        // console.log(selectedUsers);
    }

    // if (group) {
    //     console.log(group);
    // }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                value={groupChatName}
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                onChange={handleSearch}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {
                            loading ? <div>Loading...</div> :
                                users?.map((user) => (
                                    <UserListItem key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button isLoading={createGroupLoading} onClick={handleSubmit} colorScheme="blue">
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
