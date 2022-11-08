import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
	const { user, setUser } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false);

	useEffect(() => {
		setUser(JSON.parse(localStorage.getItem("userInfo")));
	}, [setUser]);

	// console.log(user);
	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer />}
			<Box
				display={"flex"}
				justifyContent="space-between"
				w="100%"
				h="90vh"
				p="10px"
			>
				{user && (
					<MyChats fetchAgain={fetchAgain}  />
				)}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
};

export default Chatpage;
