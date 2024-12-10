import { Link } from "react-router-dom";
import { copyToClipboard } from "../lib/utils";
import { CopySVG } from "./svg-comps/copy";
import { useAccount } from "wagmi";

export interface TokenDetailsInterface {
	tx: any;
	type: "activity" | "send" | "swap";
}
const TokenDetailsContainer = ({ tx, type }: TokenDetailsInterface) => {
	const { chain } = useAccount();
	return (
		<div className="flex flex-col table-bg !px-[16px] py-[20px] w-full rounded-[10px]">
			{(type === "activity" || type === "swap") && (
				<div className="flex-col w-full justify-between items-center">
					<div className="text-[#40303b] font-semibold w-full mb-2">
						Details
					</div>
					{tx.type === "transfer" ? (
						`Sent ${tx.amount} ${tx.tokenName} ≈ ${(
							tx?.valueInUSD ?? 0
						).toFixed(6)}  to ${
							tx.to ? `${tx.to?.slice(0, 4)}...${tx.to?.slice(-4)} ` : "~"
						}`
					) : (
						<>
							<div className="flex items-center truncate">
								Swapped &nbsp;{" "}
								{tx?.tokenAAddress ? (
									<Link
										to={`${chain?.blockExplorers?.default.url}/token/${tx?.tokenAAddress}`}
										target="blank"
										className="text-[#ffffff] hover:text-[#1212e1] font-medium text-sm"
									>
										{tx?.tokenAName}
									</Link>
								) : (
									<span className="text-[#a7a7a7] font-medium text-xs">
										{tx?.tokenAName}
									</span>
								)}
								<span className="text-[#a7a7a7] font-medium text-xs">
									(≈ {(tx?.amountA ?? 0).toFixed(2)})
								</span>
								<span className="text-[#ffffff] font-medium text-xs">
									&nbsp;to&nbsp;
								</span>
								{tx?.tokenBAddress ? (
									<Link
										to={`${chain?.blockExplorers?.default.url}/token/${tx?.tokenBAddress}`}
										target="blank"
										className="text-[#ffffff] hover:text-[#1212e1] font-medium text-sm"
									>
										{tx?.tokenBName}
									</Link>
								) : (
									<span className="text-[#a7a7a7] font-medium text-xs">
										{tx?.tokenBName}
									</span>
								)}
								<span className="text-[#a7a7a7] font-medium text-xs">
									(≈ {(tx?.amountB ?? 0).toFixed(2)})
								</span>
							</div>
						</>
					)}
					<div
						className="w-full h-[1px] my-[20px]"
						style={{
							backgroundImage:
								"linear-gradient(to right, #000 0%, #639 57%, #000)",
						}}
					></div>
					<div className="flex w-full justify-between items-center">
						<span className="text-[#40303b] font-semibold w-[30%]">Hashes</span>
						<div className="flex items-end gap-x-[10px] w-[70%] flex-wrap">
							{tx?.txHash && tx.txHash.length ? (
								tx?.txHash.map((hash: string) => (
									<div
										key={hash}
										className="flex justify-center items-center gap-x-2 text-[#a7a7a7] text-sm font-medium"
									>
										{hash ? `${hash?.slice(0, 4)}...${hash?.slice(-4)} ` : "~"}
										<CopySVG
											className="text-[#493844] cursor-pointer active:scale-90 "
											onClick={() => copyToClipboard(hash)}
										/>
									</div>
								))
							) : (
								<span className="text-[#a7a7a7] text-xs">~</span>
							)}
						</div>
					</div>
				</div>
			)}
			{type === "send" && (
				<>
					<div className="flex w-full justify-between items-center">
						<span className="text-[#40303b] font-semibold">Token</span>{" "}
						<span className="text-sm font-semibold">{tx.tokenName}</span>
					</div>
					<div className="flex w-full justify-between items-center mt-[20px]">
						<span className="text-[#40303b] font-semibold">Amount</span>{" "}
						<span className="text-sm font-semibold">
							{tx.amount} MATIC ≈ {(tx?.valueInUSD ?? 0).toFixed(6)}
						</span>
					</div>
					<div
						className="w-full h-[1px] my-[20px]"
						style={{
							backgroundImage:
								"linear-gradient(to right, #000 0%, #639 57%, #000)",
						}}
					></div>
					<div className="flex w-full justify-between items-center">
						<span className="text-[#40303b] font-semibold">To</span>
						<div className="flex items-end gap-x-[10px]">
							<span className="text-sm font-semibold">
								{tx?.txHash && tx.txHash.length ? (
									tx?.txHash.map((hash: string) => (
										<div
											key={hash}
											className="flex justify-center items-center gap-x-2 text-[#a7a7a7] text-sm font-medium"
										>
											{hash
												? `${hash?.slice(0, 4)}...${hash?.slice(-4)} `
												: "~"}
											<CopySVG
												className="text-[#493844] cursor-pointer active:scale-90 "
												onClick={() => copyToClipboard(hash)}
											/>
										</div>
									))
								) : (
									<span className="text-[#a7a7a7] text-xs">~</span>
								)}
							</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default TokenDetailsContainer;
