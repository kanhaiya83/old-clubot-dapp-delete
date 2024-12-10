import { useContext, useEffect } from "react";
import { MyStore } from "../helper/MyStore";
import { Input } from "./ui/input";
import { useAccount } from "wagmi";
import { SecuritySVG } from "../atoms/svg-comps/security";
import { useState } from "react";
import {
	DialogHeader,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./ui/dialog";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const LoginPage = () => {
	const { open } = useWeb3Modal();
	const {
		referralCode,
		setReferralCode,
		isSendOtc,
		setOtcValue,
		setIsSendOtc,
	} = useContext(MyStore);
	const [otcInput, setOtcInput] = useState("");
	const { isConnecting, isDisconnected, address } = useAccount();

	useEffect(() => {
		const url = new URL(location.href);
		const refCode = url.searchParams.get("referralCode");
		if (refCode && refCode?.length) {
			setReferralCode(refCode);
		}
	});

	return (
		<div className="!font-exo2 flex absolute top-0 left-0 z-10 justify-between items-center w-screen h-screen cluster-card-2 lg:cluster-card-1 p-0">
			<div className="flex flex-col w-full h-full relative z-10 justify-between items-center bg-cover bg-[url('./login_bg.png')]">
				<div className="login-box hidden lg:flex">
					{/* <img src="/login-bg.png" className="w-full" alt="login-bg" /> */}
					<div className="px-8 h-fit bg-transparent text-center flex flex-col mx-0 lg:mx-auto justify-center items-start lg:items-center gap-2 w-full md:w-[80%] xl:w-[60%] max-w-full lg:max-w-[550px] bg-[url('/login_bg.png')]">
						<img
							src="./robo.png"
							alt="logo"
							className="z-40 w-[200px] h-[200px] relative block object-scale-down m-auto"
						/>
						<h1 className="text-base md:text-lg lg:text-xl font-light w-full">
							Hey there!
						</h1>
						<h1 className="linear-wipe">I'm CLUBOT</h1>
						<h1 className="text-base md:text-lg lg:text-xl font-semibold w-full">
							Your Cluster Protocol Sidekick.
						</h1>
						<p className="text-sm font-light mt-2 w-full">
							Need to send some crypto, swap it for something else, or just
							check your balance?{" "}
						</p>
						<p className="text-sm font-light w-full mb-8 lg:mb-0">
							Chat with me, it's easy!
						</p>
					</div>
					<div
						className="h-[60%] w-[1px] mr-8"
						style={{
							background: "radial-gradient(#9773d2, black)",
						}}
					></div>
					<div className="flex flex-col justify-center items-center w-[60%] 2xl:w-[30%] 3xl:w-1/4 h-full mb-8">
						<img
							src="./logo-white.svg"
							alt="logo"
							className="w-[200px] h-[100px]"
						/>
						{/* <h1 className="text-4xl text-white font-bold mt-8">Welcome Back!</h1> */}
						<img
							src="./login-connect.png"
							alt="logo"
							className="w-[100px] h-[100px] object-scale-down"
						/>
						<p className="text-header text-center text-sm mt-0 mb-10">
							Connect your wallet
						</p>

						<Input
							className="h-[50px] w-[265px] rounded-[5px] mb-8 p-4 border border-border"
							placeholder="Enter referral code (if any)"
							onChange={(val) => setReferralCode(val.target.value)}
							value={referralCode}
						/>
						<div className="flex justify-end items-center">
							{/* wallet address */}
							{!isConnecting && address && (
								<div
									onClick={() => open()}
									className="btn-gradient-style !min-w-[265px]"
								>
									{address.slice(0, 4)}...{address.slice(-4)}
									<div className="flex w-6 h-6 shadow-md bg-white 	rounded-full ml-2">
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
							{/* connecting state */}
							{isConnecting && (
								<button
									disabled={true}
									className="btn-gradient-style !min-w-[265px]"
								>
									Connecting...
								</button>
							)}
							{/* disconnected state */}
							{isDisconnected && (
								<button
									className="btn-gradient-style !min-w-[265px]"
									onClick={() => open()}
								>
									<SecuritySVG /> Connect Wallet
								</button>
							)}
							{/* need to remove */}
							{/* <button
								onClick={() => handleLogOut()}
								className="btn-gradient-style !min-w-[265px]"
							>
								Disconnect
							</button> */}
						</div>
					</div>
				</div>
				<div className="flex flex-col m-auto p-6 lg:hidden justify-center items-center w-full text-center">
					<img
						src="./logo-white.svg"
						alt="logo"
						className="w-[150px] h-[100px] object-scale-down mb-10"
					/>
					<img
						src="./robo.png"
						alt="logo"
						className="z-40 w-36 h-36 relative block object-scale-down m-auto mb-6"
					/>

					<h1 className="text-base md:text-lg lg:text-xl font-light w-full">
						Hey there!
					</h1>
					<h1 className="linear-wipe my-2">I'm CLUBOT</h1>
					<h1 className="text-base md:text-lg lg:text-xl font-semibold w-full">
						Your Cluster Protocol Sidekick.
					</h1>
					<p className="text-sm font-light mt-2 w-full">
						Need to send some crypto, swap it for something else, or just check
						your balance?{" "}
					</p>
					<p className="text-sm font-light w-full mb-8 lg:mb-0">
						Chat with me, it's easy!
					</p>

					<div
						className="w-[60%] rotate-0 h-[1px] mr-8"
						style={{
							background: "radial-gradient(#9773d2, black)",
						}}
					></div>
					<div className="flex flex-col justify-center items-center w-[60%] 2xl:w-[30%] 3xl:w-1/4 h-full mb-8">
						{/* <h1 className="text-4xl text-white font-bold mt-8">Welcome Back!</h1> */}
						<img
							src="./login-connect.png"
							alt="logo"
							className="w-[100px] h-[100px] object-scale-down"
						/>
						<p className="text-header text-center text-sm mt-0 mb-10">
							Connect your wallet
						</p>

						<Input
							className="h-[50px] w-[265px] rounded-[5px] mb-8 p-4 border border-border"
							placeholder="Enter referral code (if any)"
							onChange={(val) => setReferralCode(val.target.value)}
							value={referralCode}
						/>
						<div className="flex justify-end items-center">
							{/* wallet address */}
							{!isConnecting && address && (
								<div
									onClick={async () => open()}
									className="btn-gradient-style !min-w-[265px]"
								>
									{address.slice(0, 4)}...{address.slice(-4)}
									<div className="flex w-6 h-6 shadow-md bg-white 	rounded-full ml-2">
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
							{/* connecting state */}
							{isConnecting && (
								<button
									disabled={true}
									className="btn-gradient-style !min-w-[265px]"
								>
									Connecting...
								</button>
							)}
							{/* disconnected state */}
							{isDisconnected && !address && (
								<button
									className="btn-gradient-style !min-w-[265px]"
									onClick={async () => open()}
								>
									<SecuritySVG /> Connect Wallet
								</button>
							)}
							{/* need to remove */}
							{/* <button
								onClick={() => handleLogOut()}
								className="btn-gradient-style !min-w-[265px]"
							>
								Disconnect
							</button> */}
						</div>
					</div>
				</div>
			</div>
			<Dialog
				onOpenChange={(val) => {
					setIsSendOtc(val);
				}}
				open={isSendOtc}
			>
				<DialogContent className="!block h-fit">
					<DialogHeader>
						<DialogTitle>
							<span className="text-sm font-semibold text-white text-center inline-block w-full my-[10px]">
								Enter The Verification Code
							</span>
						</DialogTitle>
						<DialogDescription>
							{isSendOtc && (
								<div className="flex flex-col w-full mt-5 pb-6">
									<Input
										className="h-[50px] w-[265px] rounded-[5px] mb-8 p-4 border border-border mx-auto"
										placeholder="Enter One time code received in email"
										onChange={(val) => setOtcInput(val.target.value)}
										value={otcInput}
									/>
									<button
										className="btn-gradient-style !min-w-[265px] w-[265px] mx-auto"
										onClick={() => setOtcValue(otcInput)}
									>
										<SecuritySVG /> Submit
									</button>
								</div>
							)}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default LoginPage;
