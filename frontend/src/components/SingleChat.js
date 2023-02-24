import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import "./styles.css";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import SendIcon from "@mui/icons-material/Send";

// const ENDPOINT = "https://talkative.onrender.com";
const ENDPOINT = "http://localhost:5100";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [allMessages, setAllMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	const { user, selectedChat, setSelectedChat, notification, setNotification } =
		ChatState();
	const toast = useToast();

	const fetchMessages = async () => {
		if (!selectedChat) {
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);
			// console.log(data);
			setLoading(false);
			setAllMessages(data);
			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Messages",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));

		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
		// eslint-disable-next-line
	}, [selectedChat]);

	const handleClick = () => {
		const sendEvent = {
			key: "Enter",
		};
		sendMessage(sendEvent);
	};

	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				};

				const params = {
					content: newMessage.trim(),
					chatId: selectedChat._id,
				};

				setNewMessage("");

				const { data } = await axios.post("/api/message", params, config);

				socket.emit("new message", data);

				setAllMessages([...allMessages, data]);
			} catch (error) {
				toast({
					title: "Error Occured!",
					description: "Failed to send Message",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	useEffect(() => {
		socket.on("message recieved", (newMessageRecieved) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				if (!notification.includes(newMessageRecieved)) {
					setNotification([newMessageRecieved, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setAllMessages([...allMessages, newMessageRecieved]);
			}
		});
	});

	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}

		let lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;

			if (timeDiff >= timerLength && typing) {
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
	};

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
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModel user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								></UpdateGroupChatModal>
							</>
						)}
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
								<ScrollableChat allMessages={allMessages} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage} isRequired mt={3}>
							{isTyping ? (
								<div
									style={{
										display: "flex",
										// justifyContent: "center",
										// alignItems: "center",
									}}
								>
									<Avatar
										mt="7px"
										mr={1}
										size="sm"
										cursor="pointer"
										// name={m.sender.name}
										src={selectedChat.users[0].pic}
									></Avatar>
									<Lottie
										display="block"
										options={defaultOptions}
										height={40}
										width={60}
										style={{ marginBottom: 12, marginLeft: 0 }}
									/>
								</div>
							) : (
								<></>
							)}
							<div style={{ display: "flex" }}>
								<Input
									variant="filled"
									bg="#E0E0E0"
									placeholder="Enter a Message..."
									onChange={typingHandler}
									value={newMessage}
									autoComplete={"off"}
								/>

								<IconButton
									// display={{ base: "flex", md: "none" }}
									ml={1}
									aria-label="Send"
									icon={<SendIcon />}
									bg="#81C6E8"
									onClick={handleClick}
									// isDisabled={newMessage ? "" : "disabled"}
								/>
							</div>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					h="100%"
				>
					<Text fontSize="3xl" pb={3} fontFamily="Work sans">
						Click on a User to start Chating
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
