// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, WALLET_ADAPTERS } from "@web3auth/base";
import { Chain } from "wagmi/chains";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

export default function Web3AuthConnectorInstance(chains: Chain[]) {
	// Create Web3Auth Instance
	const name = "cluster";
	const chainConfig = {
		chainNamespace: CHAIN_NAMESPACES.EIP155,
		chainId: "0x" + chains[0].id.toString(16),
		rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
		displayName: chains[0].name,
		tickerName: chains[0].nativeCurrency?.name,
		ticker: chains[0].nativeCurrency?.symbol,
		blockExplorerUrl: chains[0].blockExplorers?.default.url[0] as string,
	};

	const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

	const web3AuthInstance = new Web3Auth({
		clientId: "BCKrSfuJauLzPHSwjd1t6WlE4f5pO-lCyx1NgA_vaZbbs4q20T3zTsPjwWOGHxHC7Wu2pP54vtHw4c3fQcw4Q1s",
		chainConfig,
		sessionTime: 60 * 60 * 24 * 7,
		privateKeyProvider,
		uiConfig: {
			appName: name,
			loginMethodsOrder: ["google"],
			defaultLanguage: "en",
			modalZIndex: "2147483647",
			logoLight: "https://web3auth.io/images/web3authlog.png",
			logoDark: "https://web3auth.io/images/web3authlogodark.png",
			uxMode: "popup",
			mode: "dark",
		},
		web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
		enableLogging: true,
	});

	const walletServicesPlugin = new WalletServicesPlugin({
		walletInitOptions: {

			whiteLabel: {

				showWidgetButton: false,
				hideTopup: true,
			}
		}
	});
	web3AuthInstance.addPlugin(walletServicesPlugin);

	const modalConfig = {
		[WALLET_ADAPTERS.OPENLOGIN]: {
			label: "openlogin",
			loginMethods: {
				facebook: {
					// it will hide the facebook option from the Web3Auth modal.
					name: "facebook login",
					showOnModal: false,
				},
			},
			// setting it to false will hide all social login methods from modal.
			showOnModal: true,

		},
	}

	return Web3AuthConnector({
		web3AuthInstance,
		modalConfig,
	});
}
