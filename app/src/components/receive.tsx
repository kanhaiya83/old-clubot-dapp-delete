import { useLocation } from "react-router-dom";
import ReceiveTokens from "./receiveQR";
import SendRecieveSwapTab from "../atoms/send-recieve-swap-tab";
import { useAccount } from "wagmi";
const ReceivePage = () => {
	const location = useLocation();

	// TODO
	// Get value from query of the route
	// const addressQuery = useRoutes().query('address')

	const { address, chain } = useAccount();

	// const account = addressQuery ?? address

	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<SendRecieveSwapTab activeLink={location.pathname} />
			<div className="md:m-[6px] md:border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[8px] md:px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<h4 className="text-header mt-0">Receive Tokens</h4>
				<ReceiveTokens
					qrAddress={address ?? ""}
					qrSelectedChain={chain?.id ?? 1}
					qrFunctionCall={{
						functionName: "transfer",
						arguments: ["0xdeadbeef", "5"],
					}}
				/>
			</div>
		</section>
	);
};

export default ReceivePage;
