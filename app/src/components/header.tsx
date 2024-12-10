import { useContext, useEffect, useState } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";

import { fetchData } from "../helper/fetchData";
import { MyStore } from "../helper/MyStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CHAINS } from "../utils/tokens";
import { BASE_URL } from "../lib/config";
import { Button } from "./ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export const Header = () => {
	const { open } = useWeb3Modal();
	const { address, isConnecting, isDisconnected, chainId, isConnected } =
		useAccount();
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState<any>();

	const { disconnect } = useDisconnect();
	const { signMessage, data, error } = useSignMessage();

	const {
		selectedChain,
		referralCode,
		setBalances,
		setLoggedUser,
		setReferralId,
		setListedChains,
		setSelectedChain,
	} = useContext(MyStore);
	const date = new Date();
	const message = `Signing this message at : ${date.toDateString()}`;

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (address && !token && isConnected) {
			signMessage({ message, account: address });
		}
		if (address && token) {
			setUser(true);
		}
	}, [address, message, isConnected, signMessage]);

	useEffect(() => {
		if (data) {
			const param: any = {
				address: address,
				signature: data,
				message,
			};
			if (referralCode?.length) {
				param["referralCode"] = referralCode;
			}
			//call the backend to verify the signature
			fetch(`${BASE_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(param),
			})
				.then((res) => res.json())
				.then(async (res) => {
					if (!res.isValid) {
						localStorage.removeItem("token");
						return;
					}
					localStorage.setItem("token", res.access_token);
					setUser(true);
				})
				.catch(async () => {
					localStorage.removeItem("token");
				});
		}
	}, [data, address, message, referralCode]);

	useEffect(() => {
		if (address && user) {
			fetchData(`${BASE_URL}/user/me`).then((data) => {
				setReferralId(data.referral);
				if (data.address === address) {
					setUser(address);
					setLoggedUser({ address });
					if (location.pathname === "/login") {
						navigate("/");
					}
				} else {
					setLoggedUser(null);
					setUser(false);
					if (location.pathname !== "/login") {
						navigate("/login");
					}
				}
			});
		}
	}, [
		address,
		user,
		location.pathname,
		navigate,
		setLoggedUser,
		setReferralId,
	]);

	useEffect(() => {
		if (user && address && user === address && isConnected) {
			if (location.pathname === "/login") {
				navigate("/");
			}
		} else {
			if (location.pathname !== "/login") {
				navigate("/login");
			}
		}
	}, [user, address, isConnected, location.pathname, navigate]);

	useEffect(() => {
		if (address && error) {
			// handleLogOut();
		}
	}, [error, address]);

	useEffect(() => {
		if (chainId) {
			fetchData(`${BASE_URL}/context/chains`).then((data) => {
				const chains = data.filter((chain: any) => {
					// Check if it is there in CHAINS
					return CHAINS.some((c) => c.id === chain.community_id);
				});
				setListedChains(chains);
				data.forEach((chain: any) => {
					if (chain.community_id === chainId) {
						setSelectedChain(chain);
					}
				});
			});
			// fetchData(`${BASE_URL}/user/token-list/${chain?.id}`).then((data) => {
			//   console.log(`data: `, data);
			//   // setChatList(data);
			// });
		}
	}, [chainId, setListedChains, setSelectedChain]);

	useEffect(() => {
		if (selectedChain) {
			fetchData(`${BASE_URL}/user/token-list/${selectedChain?.id}`).then(
				(data) => {
					setBalances(data);
				}
			);
		}
	}, [selectedChain, setBalances]);

	return (
		<header
			className={`z-30 bg-black h-[92px] p-[22px] rounded-t-[8px] border border-[#232323] flex items-center ${location?.pathname === "/login" ? "invisible" : "relative visible"
				}`}
		>
			<div className="flex justify-between items-center w-full">
				<Link
					to="/"
					className="font-seph text-white flex items-center gap-x-[16px]"
				>
					<img
						src="./logo-white.svg"
						alt="brand"
						className="w-[48px h-[48px]"
					/>
				</Link>
				{location?.pathname !== "/login" && (
					<div className="flex justify-end items-center">
						{/* wallet address */}
						{!isConnecting && address && (
							<div
								onClick={() => open({ view: "Account" })}
								className="btn-gradient-style gap-x-2 hidden md:flex"
							>
								{address.slice(0, 4)}...{address.slice(-4)}
								<div className="flex w-6 h-6 shadow-md bg-white rounded-full ml-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="m-auto"
										width="15"
										height="15"
										viewBox="0 0 32 32"
									>
										<path fill="#9773d2" d="M22 17h2v2h-2z" />
										<path
											fill="#9773d2"
											d="M28 8H4V5h22V3H4a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2M4 26V10h24v3h-8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8v3Zm24-11v6h-8v-6Z"
										/>
									</svg>
								</div>
							</div>
						)}
						{/* <Link to="/profile" className="flex-center">
    Profile
  </Link> */}
						{/* connecting state */}
						{isConnecting && (
							<button
								disabled={true}
								className="btn-gradient-style hidden md:block"
							>
								Connecting...
							</button>
						)}
						{/* disconnected state */}
						{isDisconnected && (
							<button
								className="btn-gradient-style hidden md:block"
								onClick={() => open({ view: "Account" })}
							>
								Connect Wallet
							</button>
						)}
						<Button
							onClick={async () => {
								localStorage.clear();
								sessionStorage.clear();
								disconnect();
								window.location.reload();
							}}
							variant="outline"
							className="hidden md:flex !gap-x-2 !border-border !text-sm font-medium  !w-fit !min-w-fit ml-2"
						>
							{/* Logout */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<path
									fill="#9874d3"
									fillOpacity=".7"
									d="m15.014 3.164l1.924-.32c1.435-.24 2.153-.36 2.73-.227A3 3 0 0 1 21.775 4.4C22 4.95 22 5.677 22 7.131v9.935c0 1.273 0 1.91-.173 2.397a3 3 0 0 1-2.301 1.95c-.51.09-1.137-.015-2.393-.224l-2.12-.353c-2.394-.4-3.591-.599-4.302-1.438c-.711-.84-.711-2.053-.711-4.48V9.082c0-2.428 0-3.642.71-4.48c.712-.84 1.91-1.04 4.304-1.439"
								/>
								<path
									fill="#5ab7da"
									d="m3 12l-.469-.375l-.3.375l.3.375zm9 .6a.6.6 0 1 0 0-1.2zM6.531 6.625l-4 5l.938.75l4-5zm-4 5.75l4 5l.938-.75l-4-5zM3 12.6h9v-1.2H3z"
								/>
							</svg>
						</Button>
					</div>
				)}
			</div>
		</header>
	);
};
