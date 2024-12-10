import { useContext, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "./ui/dialog";
import { CHAINS } from "../utils/tokens";
import { useAccount, useSwitchChain } from "wagmi";
import { toast } from "sonner";
import NetworkSVG from "../atoms/svg-comps/network";
import { Button } from "./ui/button";
import { MyStore } from "../helper/MyStore";

export function Networks() {
	const { listedChains, setListedChains } = useContext(MyStore);
	const [selectedNetwork, setSelectedNetwork] = useState(CHAINS[0]);
	const [showDialog, setShowDialog] = useState(false);
	// const [chains, setChains] = useState([] as any[]);
	const { chainId } = useAccount();
	const { switchChain, isSuccess } = useSwitchChain();

	function setNetwork(chain: any) {
		setSelectedNetwork(chain as any);
		setShowDialog(false);
		switchChain({ chainId: chain.community_id });
	}

	useEffect(() => {
		if (isSuccess) {
			toast("Network Changed", {
				description: `Your network has been switched to ${selectedNetwork.name}`,
			});
		}
	}, [isSuccess, selectedNetwork]);

	return (
		<Dialog
			onOpenChange={(val) => {
				setShowDialog(val);
			}}
			open={showDialog}
		>
			<DialogTrigger asChild>
				<Button className="!p-0 h-auto !bg-background">
					<div className="cluster-card bg-background h-[100px] gap-x-3 w-[25%] min-w-[300px] max-w-[600px] rounded-[10px] flex items-center justify-start">
						<NetworkSVG className="w-[25px] text-white mr-[18px]" />
						<div className="flex flex-col gap-y-[3px]">
							<span className="text-base text-left font-semibold text-white">
								Networks
							</span>
							<span className="text-sm font-normal text-[#534949]">
								Select primary network
							</span>
						</div>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className="!block h-[500px] p-0">
				<DialogHeader>
					<span className="text-sm font-semibold text-white text-center inline-block my-[10px]">
						Choose Network
					</span>
					<div className="px-[16px]">
						<input
							onChange={(e) => {
								if (e.target.value === "") {
									const filteredChains = CHAINS;
									setListedChains(filteredChains as any);
								} else {
									const filteredChains = listedChains?.filter(
										(chain: any) =>
											chain.id
												.toString()
												.includes(e.target.value.toLowerCase()) ||
											chain.name
												.toLowerCase()
												.includes(e.target.value.toLowerCase())
									);
									setListedChains(filteredChains as any);
								}
							}}
							type="search"
							className="text-xs bg-border/30 px-[14px] outline-none rounded-[5px] block h-[39px] w-full bg-[#000000]/40"
							placeholder="Search"
						/>
						<span
							className="block w-full h-[1px] my-[16px]"
							style={{
								background:
									"linear-gradient(to right, #22171e 0%, #493844 49%, #21171e 100%)",
							}}
						></span>
					</div>
				</DialogHeader>
				<div className="pt-[8px] w-full relative z-30 block select-none">
					<div className="w-full max-h-[350px] pb-[10px] rounded-[8px] text-center overflow-y-auto">
						<ul className="flex justify-start flex-col gap-y-[12px] px-[10px]">
							{listedChains?.map((chain: any) => (
								<li
									key={chain.community_id}
									onClick={() => setNetwork(chain)}
									className="flex justify-between items-center hover:bg-[#1a0a24] px-[6px] py-[4px] rounded-[5px] cursor-pointer"
								>
									<div className="flex gap-x-[5px]">
										<img
											src={chain.logo_url}
											alt=""
											className="w-[30px] mr-1 bg-white p-[2px] rounded-[10px] h-[30px] object-contain"
										/>
										<div className="flex flex-col items-start">
											<span className="text-[#a7a7a7] font-medium text-xs">
												{chain.name}
											</span>
											<span className="text-[#656565] text-xs uppercase">
												{chain.native_token_id}
											</span>
										</div>
									</div>
									<div className="w-[18px] h-[18px] rounded-full overflow-hidden relative">
										<div
											className={`absolute top-0 left-0 w-[18px] h-[18px] rounded-full border ${
												chainId !== chain.community_id
													? "border-[#5BB8DA]"
													: "border-[#5BB8DA]"
											}`}
										/>
										<div
											className={`absolute top-[3.75px] left-[4.2px] w-[10px] h-[10px] rounded-full ${
												chainId !== chain.community_id
													? "bg-transparent border-transparent"
													: "bg-[#5BB8DA] border-[#5BB8DA]"
											}`}
										/>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
