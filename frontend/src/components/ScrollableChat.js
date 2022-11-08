import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ allMessages }) => {
	// console.log(allMessages);
	const { user } = ChatState();
	return (
		<ScrollableFeed>
			{allMessages &&
				allMessages.map((m, i) => (
					<div style={{ display: "flex" }} key={m._id}>
						{(isSameSender(allMessages, m, i, user._id) ||
							isLastMessage(allMessages, i, user._id)) && (
							<Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
								<Avatar
									mt="7px"
									mr={1}
									size="sm"
									cursor="pointer"
									name={m.sender.name}
									src={m.sender.pic}
								></Avatar>
							</Tooltip>
						)}
						<span
							style={{
								backgroundColor: `${
									m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
								}`,
								borderRadius: "20px",
								padding: "5px 15px",
								maxWidth: "75%",
								marginLeft: isSameSenderMargin(allMessages,m,i,user._id),
								marginTop: isSameUser(allMessages, m, i, user._id) ? 3 : 10,
							}}
						>
							{m.content}
						</span>
					</div>
				))}
		</ScrollableFeed>
	);
};

export default ScrollableChat;
