import React, { useState } from "react";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const history = useHistory();

	const submitHandler = async () => {
		setLoading(true);
		if (!user.email || !user.password) {
			toast({
				title: "Please Fill all the Fields",
				status: "warning",
				duration: 5000,

				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}

		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			let params = {
				email: user.email,
				password: user.password,
			};
			// const { data } = await axios.post('/api/user', params, config);
			const { data } = await axios.post("/api/user/login", params, config);
			// console.log(data);
			toast({
				title: "Login Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});

			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			history.push("/chats");
		} catch (error) {
			toast({
				title: "Error Occured",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	const handleLogin = (event) => {
		if (event.key === "Enter") {
			submitHandler();
		}
	};

	function handleChange(event) {
		setUser((prevUserData) => {
			return {
				...prevUserData,
				[event.target.name]: event.target.value,
			};
		});
	}
	const handleClick = () => {
		setShow(!show);
	};

	return (
		<VStack spacing="5px">
			<FormControl isRequired onKeyDown={handleLogin}>
				<FormLabel>Email</FormLabel>
				<Input
					id="email"
					placeholder="Enter Your Email"
					onChange={handleChange}
					name="email"
					value={user.email}
					autoComplete="off"
				/>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						id="password"
						type={show ? "text" : "password"}
						placeholder="Enter Your Password"
						onChange={handleChange}
						name="password"
						value={user.password}
					/>
					<InputRightElement width={"4.5rem"}>
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? <ViewIcon /> : <ViewOffIcon />}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={loading}
				bg="#083AA9"
			>
				Login
			</Button>
			<Button
				variant="solid"
				colorScheme="red"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={() => {
					setUser((prevUser) => {
						return {
							...prevUser,
							email: "guest@example.com",
							password: "123456",
						};
					});
				}}
			>
				Get Guest User Credentials
			</Button>
		</VStack>
	);
};

export default Login;
