import React, { useState } from "react";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	useToast,
	VStack,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		pic: "",
	});
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const toast = useToast();

	const postDetails = (pics) => {
		setLoading(true);
		if (pics === undefined) {
			toast({
				title: "Please Select an Image",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (pics.type === "image/jpeg" || pics.type === "image/png") {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "chat-app");
			data.append("cloud_name", "dq3nhj8yh");
			fetch("https://api.cloudinary.com/v1_1/dq3nhj8yh/image/upload", {
				method: "post",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setUser((prevUser) => {
						return {
							...prevUser,
							pic: data.url.toString(),
						};
					});
					// console.log(data);
					console.log(data.url.toString());
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else {
			toast({
				title: "Please Select an Image",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}
	};
	const submitHandler = async () => {
		setLoading(true);
		if (!user.name || !user.email || !user.password) {
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
				name: user.name,
				email: user.email,
				password: user.password,
				pic: user.pic
					? user.pic
					: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
			};
			// const { data } = await axios.post('/api/user', params, config);
			const { data } = await axios.post("/api/user", params, config);
			// console.log(data);
			toast({
				title: "Registration Successful",
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

	const handleSignUp = (event) => {
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
			<FormControl isRequired onKeyDown={handleSignUp}>
				<FormLabel>Name</FormLabel>
				<Input
					id="signUpName"
					placeholder="Enter Your Name"
					onChange={handleChange}
					name="name"
					value={user.name}
					autoComplete="off"
				/>
				<FormLabel>Email</FormLabel>
				<Input
					id="signUpEmail"
					placeholder="Enter Your Email"
					onChange={handleChange}
					name="email"
					value={user.email}
					autoComplete="off"
				/>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						id="signUpPassword"
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
			<FormControl>
				<FormLabel>Upload your Picture</FormLabel>
				<Input
					type="file"
					p={0.5}
					accept="image/*"
					onChange={(e) => postDetails(e.target.files[0])}
				></Input>
				<Button
					colorScheme="blue"
					width="100%"
					style={{ marginTop: 15 }}
					onClick={submitHandler}
					isLoading={loading}
					bg="#083AA9"
				>
					Sign Up
				</Button>
			</FormControl>
		</VStack>
	);
};

export default SignUp;
