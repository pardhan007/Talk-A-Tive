import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
// import Spinner from "@chakra-ui/spinner";

const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);
	const history = useHistory();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const {
		user,
		setSelectedChat,
		chats,
		setChats,
		refreshPage,
		notification,
		setNotification,
	} = ChatState();

	const logoutHandler = () => {
		localStorage.removeItem("userInfo");
		refreshPage();
		history.push("/");
	};

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Please Enter Something in Search",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`/api/user?search=${search}`, config);
			// console.log(data);
			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Search Resilts",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	const handleSearchByEnter = (event) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post("/api/chat", { userId }, config);

			if (!chats.find((chat) => chat._id === data._id)) {
				setChats([data, ...chats]);
			}

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: "Error Fetching the chat",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				width="100%"
				p="5px 10px 5px 10px"
				borderWidth="5px"
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
					<Button variant="ghost" onClick={onOpen}>
						<SearchIcon />
						<Text display={{ base: "none", md: "flex" }} px="4">
							Search User
						</Text>
					</Button>
				</Tooltip>

				<Text fontSize="2xl" fontFamily="work sans">
					Talk-A-Tive
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<NotificationBadge
								count={notification.length}
								// effect={Effect.SCALE}
							/>
							<BellIcon fontSize="2xl" m={1} />
						</MenuButton>
						<MenuList pl={3}>
							{!notification.length && "No New Messages"}
							{notification.map((notif) => (
								<MenuItem
									key={notif._id}
									onClick={() => {
										setSelectedChat(notif.chat);
										setNotification(notification.filter((n) => n !== notif));
									}}
								>
									{notif.chat.isGroupChat
										? `New Message in ${notif.chat.chatName}`
										: `New Message from ${getSender(user, notif.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size="sm"
								cursor="pointer"
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModel user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModel>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								onKeyDown={handleSearchByEnter}
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						)}
						{loadingChat && <Spinner ml="auto" display={"flex"} />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
