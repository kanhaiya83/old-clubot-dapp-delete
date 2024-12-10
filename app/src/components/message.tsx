import clsx from "clsx";
import domPurify from "dompurify";
import { FC, useMemo } from "react";
import { useAccount } from "wagmi";
import { Spinner } from "../atoms/svg-comps/spinner";
import { markdownToHtml } from "../helper/formatter";
import ChatTable from "./chat-table";
import { ChatButton } from "./chatBtn";
import ReceiveTokens from "./receiveQR";

interface MessageProps {
	from: "sender" | "receiver";
	message: string;
	tableData: any[];
	web3Data: any;
	isLast: boolean;
	isLoading: boolean;
}

const Message: FC<MessageProps> = ({ from, message, tableData, web3Data, isLast, isLoading }) => {
	const sanitizedMessage = useMemo(
		() => domPurify.sanitize(message, {
			ALLOWED_ATTR: ["target", "href", "src", "alt", "title", "style"],
		}),
		[message]
	);

	const formattedMessage = useMemo(() => markdownToHtml(sanitizedMessage), [sanitizedMessage]);

	const { address } = useAccount();
	const { chain } = useAccount();

	return (
		<div
			className={clsx(
				from === "sender" && !isLoading
					? "justify-end"
					: "justify-end flex-row-reverse",
				"flex w-full gap-x-[12px] items-start"
			)}
			id="message"
		>
			{isLoading ? (
				<div
					className={clsx(
						from === "receiver"
							? "bg-[#5BB8DA]/20 border-2 border-[#5BB8DA] rounded-br-0"
							: "bg-[#3b1760]/20 border-2 border-[#3b1760] rounded-bl-0",
						'px-[10px] md:px-[18px] py-[10px] rounded-[12px] break-all w-fit max-w-[40px] md:max-w-[425px] xl:max-w-[600px]'
					)}
				>
					<Spinner />
				</div>
			) : (
				<div
					className={clsx(
						from === "sender"
							? "bg-[#5BB8DA]/20 border-2 border-[#5BB8DA] rounded-br-0"
							: "bg-[#3b1760]/20 border-2 border-[#3b1760] rounded-bl-0",
						'px-[10px] md:px-[18px] py-[10px] rounded-[12px] break-all w-fit max-w-[400px] md:max-w-[425px] xl:max-w-[600px]'
					)}
				>
					<div
						dangerouslySetInnerHTML={{ __html: formattedMessage }}
						className="text-sm md:text-base"
						style={{ wordBreak: "break-word" }}
					/>
					{tableData && (typeof tableData === "string" && tableData === "qr-code" ? (
						<ReceiveTokens qrAddress={address ?? ""} />
					) : (
						tableData.length > 0 && <ChatTable data={tableData} />
					))}
					{web3Data && (
						<div className="flex flex-col gap-y-2">
							{web3Data.type === "current-network" ? (
								<p className="text-base font-bold">{chain?.name}</p>
							) : (
								<ChatButton buttonText="Confirm" params={web3Data} isLast={isLast} />
							)}
						</div>
					)}
				</div>
			)}
			<div className="overflow-hidden shrink-0">
				<img
					src={`./social-icons/${from === "receiver" ? "bot" : "user"}.png`}
					alt=""
					className="w-[30px] h-[30px] md:w-[48px] md:h-[48px] rounded-full object-scale-down"
				/>
			</div>
		</div>
	);
};

export default Message;
