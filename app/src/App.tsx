import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { createConfig, WagmiProvider } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/main-layout";
import Bot from "./components/bot";
import PWABadge from "./PWABadge";
import Activity from "./components/activity";
import Dashboard from "./components/dashboard";
import SendPage from "./send";
import ReceivePage from "./components/receive";
import SwapPage from "./components/swap";
import ReferralsPage from "./components/referrals";
import ProfilePage from "./components/profile-page";
import MorePage from "./components/more/more";
import AddTokenPage from "./components/more/balance-tokens";
import ContactPage from "./components/more/contacts";
import LoginPage from "./components/login";
import { MyStore } from "./helper/MyStore";
import { Toaster } from "./components/ui/sonner";
import { CHAINS, transports } from "./utils/tokens";
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";

// QueryClient for React Query
const queryClient = new QueryClient();
const projectId = "7aac5c0b2bade614c628fc5d61555a09";
const metadata = {
	name: "Web3Modal",
	description: "Web3Modal Example",
	url: "https://web3modal.com",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const config = createConfig({
	chains: CHAINS,
	transports: transports,
	connectors: [
		walletConnect({ projectId, metadata, showQrModal: false }),
		Web3AuthConnectorInstance(CHAINS as any),
	],
});

createWeb3Modal({
	wagmiConfig: config,
	projectId,
	enableAnalytics: true,
	enableOnramp: true,
});

const App: React.FC = () => {
	const [loggedUser, setLoggedUser] = useState(null);
	const [chatList, setChatList] = useState([]);
	const [selectedChat, setSelectedChat] = useState("");
	const [sendToken, setSendToken] = useState(null);
	const [referralId, setReferralId] = useState("");
	const [selectedChain, setSelectedChain] = useState("");
	const [listedChains, setListedChains] = useState<any[]>([]);
	const [balances, setBalances] = useState<any[]>([]);
	const [receiveToken, setReceiveToken] = useState(null);
	const [referralCode, setReferralCode] = useState("");
	const [chatInboxActive, setChatInboxActive] = useState(false);
	const [isSendOtc, setIsSendOtc] = useState(false);
	const [otcValue, setOtcValue] = useState("");
	const [chatHistory, setChatHistory] = useState<any[]>([]);
	const [isChatLoading, setIsChatLoading] = useState(false);

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<PWABadge />
				<MyStore.Provider
					value={{
						loggedUser,
						setLoggedUser,
						chatList,
						setChatList,
						selectedChat,
						setSelectedChat,
						sendToken,
						setSendToken,
						referralId,
						setReferralId,
						selectedChain,
						setSelectedChain,
						listedChains,
						setListedChains,
						balances,
						setBalances,
						receiveToken,
						setReceiveToken,
						referralCode,
						setReferralCode,
						isSendOtc,
						setIsSendOtc,
						otcValue,
						setOtcValue,
						chatInboxActive,
						setChatInboxActive,
						chatHistory,
						setChatHistory,
						isChatLoading,
						setIsChatLoading,
					}}
				>
					<Router>
						<Routes>
							<Route path="/" element={<MainLayout />}>
								<Route index element={<Dashboard />} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/bot" element={<Bot />} />
								<Route path="/activity" element={<Activity />} />
								<Route path="/send" element={<SendPage />} />
								<Route path="/receive" element={<ReceivePage />} />
								<Route path="/cluster-receive" element={<ReceivePage />} />
								<Route path="/swap" element={<SwapPage />} />
								<Route path="/referrals" element={<ReferralsPage />} />
								<Route path="/profile" element={<ProfilePage />} />
								<Route path="/more" element={<MorePage />} />
								<Route path="/more/balance-tokens" element={<AddTokenPage />} />
								<Route path="/more/contacts" element={<ContactPage />} />
							</Route>
						</Routes>
					</Router>
					<Toaster />
				</MyStore.Provider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default App;
