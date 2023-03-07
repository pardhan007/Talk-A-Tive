import { useDisclosure } from "@chakra-ui/hooks";
import {
	Box,
	Button,
	FormControl,
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

const GroupChatModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const toast = useToast();

	const { user, chats, setChats } = ChatState();

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
			const { data } = await axios.get(`https://talkative.onrender.com/api/user?search=${search}`, config);
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

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: "User already Added",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		setSelectedUsers([...selectedUsers, userToAdd]);
	};

	const handleDelete = (userToDelete) => {
		setSelectedUsers(
			selectedUsers.filter((seluser) => seluser._id !== userToDelete._id)
		);
	};

	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: "Please Fill all the fields",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			let params = {
				name: groupChatName,
				users: JSON.stringify(selectedUsers.map((u) => u._id)),
			};

			const { data } = await axios.post("https://talkative.onrender.com/api/chat/group", params, config);

			setChats([data, ...chats]);
			onClose(); // closing the model

			toast({
				title: "New Group Chat Created",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		} catch (error) {
			toast({
				title: "Failed to create group chat",
				description: error.response.data,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display="flex"
						justifyContent={"center"}
						fontSize="25px"
						fontFamily={"Work sans"}
					>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDir="column" alignItems="center">
						<FormControl>
							<Input
								placeholder="Group Name"
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
								value={groupChatName}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add Users eg: Neil, Nitin, Mukesh"
								mb={2}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box display="flex" width="100%" flexWrap="wrap">
							{selectedUsers.map((user) => (
								<UserBadgeItem
									key={user._id}
									user={user}
									handleFunction={() => handleDelete(user)}
								/>
							))}
						</Box>
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
										handleFunction={() => handleGroup(user)}
									/>
								))
						)}
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" onClick={handleSubmit}>
							Create Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
