import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
	return (
		<Stack>
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
			<Skeleton height="50px" borderRadius="lg" />
		</Stack>
	);
};

export default ChatLoading;
