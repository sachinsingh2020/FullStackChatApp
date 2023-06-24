import React, { useEffect } from 'react'
import { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, Button, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../redux/actions/user'
import { fileUploadStyle } from '../../App'

const Signup = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [show, setShow] = useState(false);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState("");
    const [file, setFile] = useState("");
    const handleClick = () => setShow(!show);

    const { loading, error, message } = useSelector(state => state.user);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmpassword) {
            return toast({
                title: "Empty Fields",
                description: "Please Fill All the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }

        if (password !== confirmpassword) {
            return toast({
                title: "Password Mismatch",
                description: "Password and Confirm Password do not match",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
        console.log(file);
        if (!file) {
            return toast({
                title: "No File Selected",
                description: "Please Select a File",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
        const myForm = new FormData();

        myForm.append("name", name);
        myForm.append("email", email);
        myForm.append("password", password);
        myForm.append("confirmpassword", confirmpassword);
        myForm.append("file", pic);

        await dispatch(register(myForm));
    }

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
    }, [dispatch, error, message, toast]);
    const postDetails = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        console.log(selectedFile); // Check the properties of the selected file
        console.log(selectedFile.type); // Check the MIME type

        if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png" || selectedFile.type === "image/jpg") {
            setPic(selectedFile);
        } else {
            return toast({
                title: "Invalid File Type",
                description: "Please Select a Valid File Type",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    };


    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    value={name}
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    value={email}
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={password}
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={confirmpassword}
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic" >
                <FormLabel textAlign="left">Upload your Picture</FormLabel>
                <Input
                    accept="image/*"
                    required
                    type="file"
                    css={fileUploadStyle}
                    focusBorderColor="rgb(133, 50, 92)"
                    w="100%"
                    onChange={postDetails}
                    textAlign="center"
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup
