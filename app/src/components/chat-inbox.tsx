import { useContext, useEffect, useRef, useState } from "react";
import { SendSVG } from "../atoms/svg-comps/send";
import Message from "./message";
import { MyStore } from "../helper/MyStore";
import { fetchData } from "../helper/fetchData";
import { BASE_URL } from "../lib/config";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useAccount } from "wagmi";
import { QuickChatPrompts } from "../helper/constants/quick-chat-prompts";

const ChatInbox: React.FC = () => {
	const {
		loggedUser,
		selectedChat,
		setSelectedChat,
		setChatList,
		chatInboxActive,
		setChatInboxActive,
		chatHistory,
		setChatHistory,
		isChatLoading,
		setIsChatLoading,
	} = useContext(MyStore);

	const [message, setMessage] = useState("");
	const chatEndRef = useRef<HTMLDivElement>(null);

	const maxCharCount = 4000;

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		if (value.length <= maxCharCount) {
			setMessage(value);
		}
	};

	useEffect(() => {
		if (loggedUser && selectedChat) {
			setIsChatLoading(true);
			fetchData(`${BASE_URL}/assistant/chats/${selectedChat}`)
				.then((data) => {
					console.log("🚀 ~ .then ~ data:", data);
					setChatHistory(data?.messages || []);
				})
				.finally(() => {
					setIsChatLoading(false);
				});
		}
		if (selectedChat === "") {
			setChatHistory([]);
		}
	}, [loggedUser, selectedChat, setChatHistory, setIsChatLoading]);
	const { chain } = useAccount();

	const sendMessage = async (message: string) => {
		if (message.trim() === "") return;
		setMessage("");
		setChatHistory((prevHistory: any) => [
			...prevHistory,
			{ role: "user", content: message },
		]);
		setIsChatLoading(true);
		const data = await fetchData(`${BASE_URL}/assistant/chat`, "POST", {
			message,
			chatId: selectedChat,
			chainId: chain?.id,
		});

		if (selectedChat === "") {
			if (data?.length > 0) {
				setSelectedChat(data?.[0]?.chatId);
			} else {
				setSelectedChat(data?.chatId);
			}
			const chatListData = await fetchData(`${BASE_URL}/assistant/chats`);
			setChatList(chatListData);
		}

		console.log("🚀 ~ sendMessage ~ data:", data);
		if (data?.length > 0) {
			data.forEach((chat: any) => {
				setChatHistory((prevHistory: any) => [
					...prevHistory,
					{
						role: chat?.role,
						content: chat?.content,
						extra: {
							table: chat?.extra?.table,
							web3Data: chat?.extra?.web3Data,
						},
					},
				]);
			});
			console.log("🚀 ~ sendMessage ~ data:", data);
		} else {
			setChatHistory((prevHistory: any) => [
				...prevHistory,
				{
					role: data?.role,
					content: data?.content,
					extra: {
						table: data?.extra?.table,
						web3Data: data?.extra?.web3Data,
					},
				},
			]);
		}
		setIsChatLoading(false);
	};

	useEffect(() => {
		if (selectedChat === "" || chatHistory.length === 0) return;
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatHistory, selectedChat]);

	if (window.innerWidth < 1024 && !chatInboxActive) {
		return null;
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter") {
			if (e.shiftKey) {
				e.preventDefault();
				setMessage((prevMessage) => prevMessage + "\n");
			} else {
				e.preventDefault();
				sendMessage(message);
			}
		}
	};

	const quickPromptHandler = ({ prompt }: { prompt: string }) => {
		setMessage(prompt);
		sendMessage(prompt);
	};

	return (
		<section id="wrapper" className="h-[calc(100vh-124px)] w-full">
			<div className="flex lg:hidden justify-between items-center px-[16px] py-[16px]">
				<div
					className="text-sm text-white flex items-center gap-x-[5px]"
					onClick={(e) => {
						e.stopPropagation();
						setChatInboxActive(false);
					}}
				>
					<ArrowLeftIcon className="w-[20px] h-[20px] text-white" />
					<span className="pt-[2px]">Chat History</span>
				</div>
			</div>
			<div
				id="chatInbox"
				className="px-[8px] md:px-[20px] h-[calc(100%-90px)] md:h-[calc(100%-80px)] flex flex-col gap-y-[20px] py-[20px] overflow-y-auto hideScrollbar relative"
			>
				{chatHistory.length ? (
					<>
						{chatHistory.map((chat, index) => (
							<Message
								key={index}
								from={chat.role === "user" ? "sender" : "receiver"}
								message={chat.content}
								tableData={
									chat?.extra?.table === "qr-code"
										? "qr-code"
										: chat?.extra?.table
								}
								web3Data={chat?.extra?.web3Data}
								isLast={index === chatHistory.length - 1}
								isLoading={false}
							/>
						))}
						{isChatLoading && (
							<Message
								from={"sender"}
								message={"Loading..."}
								tableData={[]}
								web3Data={[]}
								isLast={true}
								isLoading={isChatLoading}
							/>
						)}
					</>
				) : (
					<div className="flex flex-col lg:items-center h-full justify-center lg:justify-end">
						<div className="flex flex-col justify-center items-center text-base tracking-wider">
							<img
								src="./robo.png"
								alt="chat"
								className="w-auto h-[120px] object-scale-down"
							/>
							<span className="text-md mt-2">
								Welcome to CluBot - AI Crypto Copilot!
							</span>
							<p className="text-xs leading-tight mt-2 max-w-[800px]">
								Explore the world of cryptocurrency with CluBot, your AI guide.
								Track digital currency trends, manage your portfolio, and
								contacts with your companion. It supports Ethereum, Polygon,
								Binance Smart Chain (BSC), Arbitrum, Optimism, Avalanche, Base
								Network, and Cosmos Hub.
							</p>
						</div>
						<div className="max-w-screen lg:max-w-[800px] overflow-auto flex flex-col lg:flex-row flex-nowrap lg:flex-wrap gap-[10px] mt-5 scrollbarNone ">
							{QuickChatPrompts.map((prompt, index) => (
								<div
									key={index}
									className="btn-gradient rounded-[20px] px-2 py-2 text-xs cursor-pointer shrink-0"
									onClick={() => quickPromptHandler({ prompt })}
								>
									{prompt}
								</div>
							))}
						</div>
					</div>
				)}
				<div ref={chatEndRef} />
			</div>
			<div
				id="chatInput"
				className="flex items-center w-auto h-[64px] mx-[8px] mt-0 mb-[8px] fixed bottom-0 md:bottom-[40px] lg:bottom-0 md:relative"
			>
				<textarea
					disabled={isChatLoading}
					placeholder={isChatLoading ? "Loading..." : "Enter your message here"}
					className="bg-transparent h-[64px] max-h-[100px] py-4 w-full rounded-[8px] px-[20px] outline-none text-[16px] font-medium scrollbarNone"
					value={message}
					onKeyDown={handleKeyDown}
					onChange={handleInputChange}
					rows={4}
					style={{ resize: "none" }}
				/>
				<SendSVG
					onClick={sendMessage}
					className={`text-[#663399] w-[30px] h-[35px] mr-[20px] cursor-pointer ${
						(message.trim() === "" || isChatLoading) &&
						"opacity-50 pointer-events-none"
					}`}
				/>
			</div>
			<div className="text-xs text-gray-500 w-full text-right pr-2">
				{maxCharCount - message.length} characters left
			</div>
		</section>
	);
};

export default ChatInbox;
