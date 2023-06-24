import { Box, Container, Text } from '@chakra-ui/react'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'
import React from 'react'
import Login from '../Authentication/Login'
import Signup from '../Authentication/Signup'

const HomePage = () => {
    return (
        <Container>
            <Box display={'flex'} justifyContent={'center'} p={3} bg={'white'} w={'100%'} m={'40px 0 15px 0'} borderRadius={'lg'} borderWidth={'1px'}  >
                <Text fontSize="4xl" fontFamily="Work sans">Chat App</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs isFitted variant="soft-rounded">
                    <TabList mb="1em">
                        <Tab>Login</Tab>
                        <Tab>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage
