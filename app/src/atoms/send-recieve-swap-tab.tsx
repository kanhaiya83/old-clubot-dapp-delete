import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const SendRecieveSwapTab = ({ activeLink }: { activeLink: string }) => {
	const navigate = useNavigate();
	return (
		<div
			className="tabs table-bg w-full !p-[1px] rounded-[10px] border border-[#261a22] grid md:hidden grid-cols-3 mt-[8px]"
			// style={{
			// 	background: "linear-gradient(75deg, #130d11 -2%, #130d11 114%)",
			// }}
		>
			<button
				className={clsx(
					activeLink === "/send" &&
						"grad1 flex-center !text-white rounded-[10px] p-0",
					"text-[#ffffff89] h-[40px]"
				)}
				onClick={() => navigate("/send")}
			>
				Send
			</button>
			<button
				className={clsx(
					activeLink === "/receive" &&
						"grad1 flex-center !text-white rounded-[10px] p-0",
					"text-[#ffffff89] h-[40px]"
				)}
				onClick={() => navigate("/receive")}
			>
				Receive
			</button>
			<button
				className={clsx(
					activeLink === "/swap" &&
						"grad1 flex-center !text-white rounded-[10px] p-0",
					"text-[#ffffff89] h-[40px]"
				)}
				onClick={() => navigate("/swap")}
			>
				Swap
			</button>
		</div>
	);
};

export default SendRecieveSwapTab;
