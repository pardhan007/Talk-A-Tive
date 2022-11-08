import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

const Homepage = () => {
	const history = useHistory();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("userInfo"));

		if (user) {
			history.push("/chats");
		}
	}, [history]);

	return (
		<Container maxW="xl" centerContent>
			<Box
				display="flex"
				justifyContent="center"
				p={3}
				// bg='white'
				// bg="#f0f1f5"
				bg="#EEEEEE"
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Text fontSize="4xl" fontFamily="Work sans">
					Talk-A-Tive
				</Text>
			</Box>
			<Box
				color="black"
				// bg="#f0f1f5"
				bg="#EEEEEE"
				// bg="white"
				w="100%"
				p={4}
				borderRadius="lg"
				borderWidth="1px"
			>
				<Tabs variant="soft-rounded">
					<TabList mb="1em">
						<Tab width="50%">Login</Tab>
						<Tab width="50%">Sign up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<SignUp />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default Homepage;
