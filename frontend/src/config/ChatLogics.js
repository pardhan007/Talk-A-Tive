export const getSender = (loggedUser, users) => {
	return users && users[0]._id === loggedUser._id
		? users[1].name
		: users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
	return users && users[0]._id === loggedUser._id ? users[1] : users[0];
};

//is Same Sender From Opposite Side

export const isSameSender = (messages, m, i, userId) => {
	// if (i < messages.length - 1) {
	// 	if (
	// 		messages[i + 1].sender._id !== m.sender._id &&
	// 		messages[i].sender._id !== userId
	// 	) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// } else {
	// 	return false;
	// }

	return (
		i < messages.length - 1 &&
		(messages[i + 1].sender._id !== m.sender._id ||
			messages[i + 1].sender._id === undefined) &&
		messages[i].sender._id !== userId
	);
};

//is Last Message From Opposite Side

export const isLastMessage = (messages, i, userId) => {
	return (
		i === messages.length - 1 &&
		messages[messages.length - 1].sender._id !== userId &&
		messages[messages.length - 1].sender._id
	);
};

export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
	if (
		i < messages.length - 1 &&
		messages[i + 1].sender._id === m.sender._id &&
		messages[i].sender._id !== userId
	)
		return 33;
	else if (
		(i < messages.length - 1 &&
			messages[i + 1].sender._id !== m.sender._id &&
			messages[i].sender._id !== userId) ||
		(i === messages.length - 1 && messages[i].sender._id !== userId)
	)
		return 0;
	else return "auto";
};
