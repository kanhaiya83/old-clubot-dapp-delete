import { DownloadIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { toPng } from "html-to-image";
import { QRCodeCanvas } from "qrcode.react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { CopySVG } from "../atoms/svg-comps/copy";
import { ShareSVG } from "../atoms/svg-comps/share";
import { MyStore } from "../helper/MyStore";
import { copyToClipboard } from "../lib/utils";
import { Button } from "./ui/button";

const ReceiveTokens = ({
	qrAddress,
	qrSelectedChain,
	qrAmount,
	qrFunctionCall,
}: {
	qrAddress: string;
	qrSelectedChain?: any;
	qrAmount?: number;
	qrFunctionCall?: {
		functionName: string;
		arguments: string[]; // Array to handle multiple arguments
	};
}) => {
	const { address } = useAccount();
	const { selectedChain } = useContext(MyStore);
	const [qrCodeData, setQrCodeData] = useState<string>(
		`ethereum:${qrAddress}?value=500&gas=0&chain=1`
	);

	useEffect(() => {
		if (qrAddress) {
			const params = new URLSearchParams();
			params.set("address", qrAddress);

			if (qrSelectedChain) {
				params.set("chain", qrSelectedChain); // Assuming network holds the EIP-681 compatible chain name
			}
			if (qrAmount) {
				params.set("value", (qrAmount * 10 ** 18).toString()); // Convert to wei (for ETH/ERC20 tokens)
			}

			if (qrFunctionCall) {
				const encodedFunctionCall = encodeURIComponent(
					`${qrFunctionCall.functionName}(${qrFunctionCall.arguments.join(
						","
					)})`
				);
				params.set("function", encodedFunctionCall);
			}

			const qrCodeData = `ethereum:${qrAddress}?${params.toString()}`;
			// const qrCodeData = `gnosissafe:${qrAddress}/transfer?${params.toString()}`;
			setQrCodeData(qrCodeData);
		}
	}, [qrAddress, qrAmount, qrFunctionCall, selectedChain, qrSelectedChain]);
	const path = location.pathname;
	const elementRef = useRef(null);
	const htmlToImageConvert = () => {
		if (!elementRef || !elementRef?.current) { return; }
		toPng(elementRef.current, { cacheBust: false })
			.then((dataUrl: any) => {
				const link = document.createElement("a");
				link.download = "Cluster_Bot_QR.png";
				link.href = dataUrl;
				link.click();
			})
			.catch((err: any) => {
				console.log(err);
			});
	};
	const [, setDataUrl] = useState("");
	useEffect(() => {
		if (elementRef.current) {
			try {
				toPng(elementRef.current, {
					quality: 0.7, // Lower quality to reduce data size
					width: 128, // Smaller image width
					height: 128, // Smaller image height
				}).then((dataUrl: any) => {
					setDataUrl(dataUrl);
				});
			} catch (error) {
				console.log("🚀 ~ convertToPng ~ error:", error);
				toast.error("Error generating QR code");
			}
		}
		// };
		// convertToPng();
	}, [elementRef]);

	const shareContent = [
		"Cluster Bot Receive Badge! 👉 ",
		path === "/cluster-receive"
			? "Scan to send tokens to me! 🚀"
			: "Scan to send tokens to you! 🚀",
		"Just scan the QR code, enter the amount and click send! 💸",
		"Check out Cluster Bot for more features! 🤖",
		"https://clusterbot.io",
	];

	return (
		<div>
			{address && (
				<div className="table-bg rounded-[20px] mt-[20px] flex flex-col justify-center md:!p-[40px]">
					<h1 className="text-[24px] font-bold text-[#493844] text-center">
						{shareContent[0]}
					</h1>
					<h2 className="text-[16px] text-[#493844] text-center">
						{shareContent[1]}
					</h2>
					<h3 className="text-[16px] text-[#493844] text-center mb-6">
						{shareContent[2]}
					</h3>
					<div className="w-fit m-auto" ref={elementRef}>
						<div className="flex flex-col items-center m-auto justify-evenly gap-y-[16px] cluster-card-1 p-6 rounded-[10px]">
							<p className="text-[16px] mb-4 font-medium">
								Receive Assets By Scanning
							</p>
							<div className="cluster-card-1 border border-[#ffffff]/20 rounded-[10px] p-2">
								<QRCodeCanvas
									value={qrCodeData}
									size={128}
									level={"H"}
									includeMargin={false}
									bgColor={"#ffffff00"}
									fgColor={"#ffffff"}
									imageSettings={{
										src: "/favicon.svg",
										x: undefined,
										y: undefined,
										height: 24,
										width: 24,
										excavate: true,
									}}
								/>
							</div>
							<div className="flex flex-col gap-y-[16px]">
								<div className="flex-center  gap-x-[8px]">
									{selectedChain.logo_url ? (
										<img src={selectedChain.logo_url} alt="logo" width={28} />
									) : (
										<img src="./etherium.png" alt="Etherium" width={36} />
									)}
									<span className="text-[#a7a7a7] text-sm truncate max-w-[170px]">
										{selectedChain?.name ?? "No Chain Selected"}
									</span>
								</div>
								<div className="flex-center  gap-x-[8px]">
									{/* <img src="./Ethereum.png" alt="Etherium" width={36} /> */}
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
									<span className="text-[#a7a7a7] text-sm truncate max-w-[170px]">
										{address}
									</span>
									<CopySVG
										className="text-[#493844] cursor-pointer active:scale-90"
										onClick={() => copyToClipboard(address || "")}
									/>
								</div>
							</div>
						</div>
					</div>
					{path !== "/cluster-receive" && (
						<div className="flex justify-center items-center gap-x-2">
							<Button
								variant="outline"
								className="my-4 flex !justify-center gap-x-2 !w-[55px] !min-w-fit"
								onClick={htmlToImageConvert}
							>
								<DownloadIcon className="w-[15px] text-white  mx-auto" />
							</Button>
							<RWebShare
								data={{
									text: 'Cluster Bot Receive Badge! 👉  ',
									url: `${window.location.origin}/cluster-receive?address=${address}`,
									title: "Scan to receive tokens!",
								}}
								key={"share_page_2"}
							>
								<Button
									variant="outline"
									className="my-4 flex !justify-center gap-x-2 !w-[55px] !min-w-fit"
								>
									<ShareSVG className="w-[15px] text-white mx-auto" />
								</Button>
							</RWebShare>
							<Link to={`/cluster-receive?address=${address}`}>
								<Button
									variant="outline"
									className="my-4 flex !justify-center gap-x-2 !w-[55px] !min-w-fit"
								>
									<ExternalLinkIcon className="w-[20px] text-white mx-auto" />
								</Button>
							</Link>
						</div>
					)}
					{path === "/cluster-receive" && (
						<>
							<h2 className="text-[16px] text-[#493844] text-center mt-6">
								{shareContent[3]}
							</h2>
							<Link
								to="/"
								className="flex justify-center items-center gap-x-2 text-[#493844] hover:text-white text-center mt-2 w-full"
							>
								<div>Cluster Bot </div>
								<ExternalLinkIcon className="w-[20px] text-white m-0" />
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default ReceiveTokens;
