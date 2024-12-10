import { useContext, useEffect } from "react";
import GradientLine from "../atoms/gradient-line";
import { fetchData } from "../helper/fetchData";
import ChatInbox from "./chat-inbox";
import ChatListingSidebar from "./chat-listing-nav";
import { MyStore } from "../helper/MyStore";
import { BASE_URL } from "../lib/config";

const Bot: React.FC = () => {
	const { loggedUser, setChatList } = useContext(MyStore);

	useEffect(() => {
		if (loggedUser) {
			fetchData(`${BASE_URL}/assistant/chats`).then((data) => {
				setChatList(data);
			});
		}
	}, [loggedUser, setChatList]);

	return (
		<>
			<ChatListingSidebar />
			<GradientLine className="hidden lg:block" />
			<ChatInbox />
		</>
	);
};

export default Bot;
