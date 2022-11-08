import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user, selectedChat, setSelectedChat } = ChatState();

	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);
	const toast = useToast();

	const handleRename = async () => {
		if (!groupChatName) {
			return;
		}

		try {
			setRenameLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const params = {
				chatId: selectedChat._id,
				newChatName: groupChatName,
			};

			const { data } = await axios.put("/api/chat/rename", params, config);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			setRenameLoading(false);
		}
		setGroupChatName("");
	};

	const handleSearch = async (query) => {
		setSearch(query);
		if (!search) {
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

	const handleAddUser = async (userToAdd) => {
		if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
			toast({
				title: "User already Added",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: "Only Admins can Add someone!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
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

			const params = {
				chatId: selectedChat._id,
				userId: userToAdd._id,
			};

			const { data } = await axios.put("/api/chat/groupadd", params, config);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	const handleRemove = async (userToRemove) => {
		if (
			selectedChat.groupAdmin._id !== user._id &&
			userToRemove._id !== user._id
		) {
			toast({
				title: "Only Admins can Remove someone!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
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

			const params = {
				chatId: selectedChat._id,
				userId: userToRemove._id,
			};

			const { data } = await axios.put("/api/chat/groupremove", params, config);

			userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			fetchMessages();
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton
				display={{ base: "flex" }}
				icon={<ViewIcon />}
				onClick={onOpen}
			/>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
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
					<ModalCloseButton />
					<ModalBody>
						<Box w="100%" display="flex" flexWrap="wrap" pb={1}>
							{selectedChat.users.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									admin={selectedChat.groupAdmin}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</Box>
						<FormControl display="flex">
							<Input
								placeholder="New Group Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme="teal"
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add User to group"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						{loading ? (
							<Spinner />
						) : (
							searchResult
								?.slice(0, 4)
								.reverse()
								.map((user) => (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => handleAddUser(user)}
									/>
								))
						)}
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="red" onClick={() => handleRemove(user)}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
