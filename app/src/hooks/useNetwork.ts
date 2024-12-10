import { useContext, useState } from "react";
import { useSwitchChain } from "wagmi";
import { getNetworkByChain } from "../utils/network";
import { MyStore } from "../helper/MyStore";

export const useNetwork = () => {
	const { switchChainAsync } = useSwitchChain();
	const { setIsChatLoading } = useContext(MyStore);
	const [selectedNetwork, setSelectedNetwork] = useState(
		getNetworkByChain("ethereum")
	);

	const setNetwork = async (chain: string) => {
		const network = getNetworkByChain(chain);
		if (network) {
			setSelectedNetwork(network);
			await switchChainAsync({ chainId: network.id });
			setIsChatLoading(true);
		}
	};

	return { setNetwork, selectedNetwork };
};
