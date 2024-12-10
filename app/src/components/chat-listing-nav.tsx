import { useContext } from "react";
import { MyStore } from "../helper/MyStore";
import { DeleteSVG } from "../atoms/svg-comps/delete";
import { fetchData } from "../helper/fetchData";
import { BASE_URL } from "../lib/config";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
// import { fetchData } from "../helper/fetchData";

const ChatListingSidebar = () => {
	const {
		chatList,
		selectedChat,
		setChatList,
		setSelectedChat,
		chatInboxActive,
		setChatInboxActive,
	} = useContext(MyStore);

	if (window.innerWidth < 1024 && chatInboxActive) {
		return false;
	}

	function deleteChat(id: string) {
		fetchData(`${BASE_URL}/openai/chat/${id}`, "DELETE")
			.then(() => {
				const newChat = chatList.filter((chat: any) => chat._id !== id);
				setChatList(newChat);
				setSelectedChat("");
				toast("Chat Deleted Successfully", {
					description:
						"Chat has been deleted successfully from your directory.",
				});
			})
			.catch((error) => {
				const message =
					error?.message || "An error occurred while deleting the chat.";
				toast("Error", {
					description: message,
					className: "!bg-red-700",
				});
			});
	}

	return (
		<>
			<div className="w-full lg:w-[400px] h-[calc(100vh-124px)] px-2 flex flex-col items-start justify-start overflow-y-auto">
				<div className="flex lg:hidden justify-between items-center px-[16px] py-[16px]">
					<div
						className="text-sm text-white flex items-center gap-x-[5px]"
						onClick={(e) => {
							e.stopPropagation();
							setChatInboxActive(true);
						}}
					>
						<ArrowLeftIcon className="w-[20px] h-[20px] text-white" />
						<span className="pt-[2px]">CluBot</span>
					</div>
					{/* <DotsVerticalIcon className="text-[#5bb8da] w-[20px] h-[20px]" /> */}
				</div>
				<div className="w-full flex items-center justify-center px-4">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setSelectedChat("");
							setChatInboxActive(true);
						}}
						className="newChatBtn font-seph rounded-[3px] mb-[20px] mt-[20px] hover:transition-all hover:w-full"
					>
						NEW CHAT +
					</button>
				</div>
				<div
					className="w-[200px] h-[1px] mb-[20px] mx-auto"
					style={{
						backgroundImage:
							"linear-gradient(to right, #000 0%, #639 57%, #000)",
					}}
				></div>
				{chatList.map((chat: any, index: number) => (
					<div
						key={index}
						className="w-full max-w-full flex items-start justify-start"
					>
						<span
							onClick={() => {
								setSelectedChat(chat._id);
								setChatInboxActive(true);
							}}
							className={`newChat w-full rounded-[5px] flex gap-x-3 justify-between py-[10px] items-center hover:bg-white/20 px-[10px] ${selectedChat === chat._id ? "bg-[#3b1760]/60" : ""
								}`}
						>
							<div
								className={`truncate text-left ${selectedChat === chat._id ? "w-[90%]" : "w-full"
									}`}
							>
								{chat.title.trim()}
							</div>

							{chat._id === selectedChat && (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<button className="h-[30px] text-red-700 w-[30px] rounded-[5px] active:scale-105 hover:bg-[#53297c3b] bg-transparent flex-center gap-x-[10px]">
											<DeleteSVG />
										</button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete the char from your history.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogAction
												onClick={() => deleteChat(chat._id)}
												className="flex cursor-pointer justify-center !w-24 h-auto text-white flex-grow-0 ml-[25px] px-4 border border-transparent py-1 rounded-[5px] bg-transparent hover:bg-accent"
											>
												Delete
											</AlertDialogAction>
											<AlertDialogCancel className="flex cursor-pointer justify-center !w-24 h-auto hover:font-semibold flex-grow-0 ml-[25px] !min-w-fit !px-4 !py-1 rounded-[5px] border border-white ">
												Cancel
											</AlertDialogCancel>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</span>
					</div>
				))}
			</div>
		</>
	);
};

export default ChatListingSidebar;
