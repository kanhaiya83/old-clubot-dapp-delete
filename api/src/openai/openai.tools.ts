import { ChatCompletionTool } from "openai/resources";

export const chatTools: ChatCompletionTool[] = [
	{
		type: "function",
		function: {
			name: "getReceiveQrCode",
			description:
				"Get the QR code for receiving native tokens which the user can share with others to receive tokens. Always show the QR code if queried.",
			parameters: {
				type: "object",
				properties: {},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "getCurrentNetwork",
			description:
				"Do not return any comments just the title. To show the current blockchain network the user is connected to. Do not ask the user for any input. Just return the function output as a response and initiate the function from frontend.",
			parameters: {
				type: "object",
				properties: {},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "switchNetwork",
			description:
				"Switch the blockchain network to a different one as specified by the user.",
			parameters: {
				type: "object",
				properties: {
					newNetwork: {
						type: "string",
						description: `The chain name of the network to switch to. e.g. "eth". If the user does not provide the new Network chain name, you can ask the user to provide the chain name. Please provide the actual chain name, not an example.
							Example:
							Question: "Can you switch the network to Binance Smart Chain?"
							Answer: "Confirm the switch to Binance Smart Chain"
							Question: Switch my chain
							Answer: "To which network would you like to switch to? Ethereum, Binance Smart Chain, Avalanche, Base Network, Polygon, Arbitrum, Optimism"
							`,
						enum: [
							"eth",
							"Ethereum",
							"mainnet",
							"bsc",
							"Binance Smart Chain",
							"avax",
							"Avalanche",
							"base",
							"Base Network",
							"matic",
							"Polygon",
							"arb",
							"Arbitrum",
							"op",
							"Optimism",
						],
					},
				},
				required: ["newNetwork"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "addContact",
			description: "Add a new contact to the address book.",
			parameters: {
				type: "object",
				properties: {
					name: {
						type: "string",
						description:
							'The name of the contact to add. e.g. "John Doe", if the user does not provide the name, you can leave this field empty',
					},
					address: {
						type: "string",
						description:
							'ethererum address of the contact to add. e.g. "0xb794f5ea0ba39494ce839613fffba74279579268", if the user does not provide the address, you can leave this field empty',
					},
				},
				required: ["name", "address"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "removeContact",
			description: "Remove a contact from the address book.",
			parameters: {
				type: "object",
				properties: {
					searchkey: {
						type: "string",
						description:
							'The search key to find the contact to remove. e.g. "John Doe", if the user does not provide the search key, you can leave this field empty',
					},
					id: {
						type: "string",
						description:
							'The id of the contact to remove. e.g. "12345", if the user does not provide the id, you can leave this field empty',
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "updateContact",
			description: "Update a contact in the address book.",
			parameters: {
				type: "object",
				properties: {
					searchkey: {
						type: "string",
						description:
							'The search key to find the contact to update. e.g. "John Doe", if the user does not provide the search key, you can leave this field empty',
					},
					id: {
						type: "string",
						description:
							'The id of the contact to update. e.g. "12345", if the user does not provide the id, you can leave this field empty',
					},
					nameToUpdate: {
						type: "string",
						description:
							'The new name of the contact to update. e.g. "John Doe", if the user does not provide the name, you can leave this field empty,',
					},
					addressToUpdate: {
						type: "string",
						description:
							'The new address of the contact to update. e.g. "0xb794f5ea0ba39494ce839613fffba74279579268", if the user does not provide the address, you can leave this field empty',
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "getContacts",
			description: "List all the contacts in the address book",
			parameters: {
				type: "object",
				properties: {
					searchkey: {
						type: "string",
						description:
							'The search key to find the contact. e.g. "John Doe", if the user does not provide the search key, you can leave this field empty',
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "getAllBalances",
			description: "Get the token balance of the user",
			parameters: {
				type: "object",
				properties: {
					address: {
						type: "string",
						description:
							'The address of the user to get the balance. e.g. "0xb794f5ea0ba39494ce839613fffba74279579268", if the user does not provide the address, you can leave this field EMPTY. please provide the actual user\'s information, not an example',
					},
					tokenSearchKey: {
						type: "string",
						description:
							'The search key to find the token. e.g. "eth", if the user does not provide the search key, you can leave this field empty',
					},
					userSearchKey: {
						type: "string",
						description:
							'The search key to find the user. e.g. "John Doe", if the user does not provide the search key, you can leave this field empty',
					},
					chainName: {
						type: "string",
						description:
							'The chain name to get the balance. e.g. "eth". If the user does not provide the chain name, you can leave this field empty',
						enum: [
							"eth",
							"Ethereum",
							"mainnet",
							"bsc",
							"Binance Smart Chain",
							"avax",
							"Avalanche",
							"base",
							"Base Network",
							"matic",
							"Polygon",
							"arb",
							"Arbitrum",
							"op",
							"Optimism",
						],
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "getTopHolders",
			description: "Get the top holders of a token on a chain.",
			parameters: {
				type: "object",
				properties: {
					tokenAddress: {
						type: "string",
						description:
							'The token address to get the top holders. e.g. "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9". If the user does not provide the token address, you can leave this field empty.  Please provide the actual token\'s information, not an example',
					},
					chainName: {
						type: "string",
						description:
							'The chain name to get the top holders. e.g. "eth". If the user does not provide the chain name, you can leave this field empty',
						enum: [
							"eth",
							"Ethereum",
							"mainnet",
							"bsc",
							"Binance Smart Chain",
							"avax",
							"Avalanche",
							"base",
							"Base Network",
							"matic",
							"Polygon",
							"arb",
							"Arbitrum",
							"op",
							"Optimism",
						],
					},
					limit: {
						type: "number",
						description:
							'The limit of the top holders to get. e.g. "10", if the user does not provide the limit, you can leave this field empty',
					},
				},
				required: ["tokenAddress", "chainName"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "getNFTsByChain",
			description:
				"Get the NFTs of the user from a specific blockchain and their prices in USD.",
			parameters: {
				type: "object",
				properties: {
					address: {
						type: "string",
						description:
							'The address of the user to get the NFTs. e.g. "0xb794f5ea0ba39494ce839613fffba74279579268", if the user does not provide the address, you can leave this field empty.  Please provide the actual user\'s information, not an example',
					},
					nftSearchKey: {
						type: "string",
						description:
							'The search key to find the NFT. e.g. "cryptokitties", if the user does not provide the search key, you can leave this field empty',
					},
					userSearchKey: {
						type: "string",
						description:
							'The search key to find the user. e.g. "John Doe", if the user does not provide the search key, you can leave this field empty',
					},
					chainName: {
						type: "string",
						description:
							'The chain name to get the nft balance. e.g. "eth". If the user does not provide the chain name, you can leave this field empty',
						enum: [
							"eth",
							"Ethereum",
							"mainnet",
							"bsc",
							"Binance Smart Chain",
							"avax",
							"Avalanche",
							"base",
							"Base Network",
							"matic",
							"Polygon",
							"arb",
							"Arbitrum",
							"op",
							"Optimism",
						],
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "getGasPrice",
			description: "Get the gas price of a chain.",
			parameters: {
				type: "object",
				properties: {
					chainName: {
						type: "string",
						description: 'The chain to get the gas price. e.g. "eth".',
						enum: [
							"eth",
							"Ethereum",
							"mainnet",
							"bsc",
							"Binance Smart Chain",
							"avax",
							"Avalanche",
							"base",
							"Base Network",
							"matic",
							"Polygon",
							"arb",
							"Arbitrum",
							"op",
							"Optimism",
						],
					},
				},
				required: ["chainName"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "getTokenOrProtocolDetails",
			description: `Get the details of a token / coin or protocol.
			**Few-Shot Examples:**
			**Example 1:**
				User:"TVL of the Uniswap protocol"
			**Example 2:**
				User:"TVL of the Uniswap protocol on the Ethereum network"
				**NOTE** Chain name is not required for this function call.
			`,
			parameters: {
				type: "object",
				properties: {
					coinOrProtocolName: {
						type: "string",
						description:
							'The coin or protocol name to get the details. e.g. "1inch", if the user does not provide the coin or protocol, you can leave this field empty',
					},
					defiId: {
						type: "string",
						description:
							'The coin or protocol id to get the details. e.g. "1", if the user does not provide the id, you can leave this field empty.',
					},
					queryType: {
						type: "string",
						description:
							'The query type to get the details. e.g. "coin" or "protocol", if the user does not provide the query type, you can leave this field empty',
						enum: ["coin", "protocol"],
					},
				},
			},
		},
	},
	{
		type: "function",
		function: {
			name: "sendTransaction",
			description: "Send a coin or crypto transaction to the blockchain.",
			parameters: {
				type: "object",
				properties: {
					chainName: {
						type: "string",
						description: `
                    The chain name to send the transaction. e.g., "eth". Make sure to ask the user to provide the chain name, coinNameOrAddress, amountToSend, and toAddressOrName.
                    **Instructions for SendTransaction Function:**
                    1. **Chain Name:** Ask the user to specify the chain name for the transaction.
                    2. **HTML Formatting:** Use HTML to highlight key information and make the instructions clear and easy to follow. For example, use <strong> for emphasis, <ul> for bullet points, and links for resources.
                    `,
						enum: [
							"eth",
							"Ethereum",
							"mainnet",
							"bsc",
							"Binance Smart Chain",
							"avax",
							"Avalanche",
							"base",
							"Base Network",
							"matic",
							"Polygon",
							"arb",
							"Arbitrum",
							"op",
							"Optimism",
						],
					},
					coinNameOrAddress: {
						type: "string",
						description: `
                    The coin name or address to send the transaction. Prefer using the coin address to avoid confusion, but if a name is provided, pass the name itself. If the user does not provide the coin name or address, leave this field empty.
                    **User Guidance:** Guide users to locate and verify the coin addresses they intend to use. Suggest checking the address against a reliable blockchain explorer.
                    **Error Prevention:** Inform users that specifying the coin address ensures the accuracy of the transaction and prevents errors in selecting unintended coins.
                    **HTML Formatting:** Use HTML to highlight key information and make the instructions clear and easy to follow.
                    `,
					},
					amountToSend: {
						type: "number",
						description: `
                    The amount of the coin to send. e.g., "0.1". If the user does not provide the amount, ensure to ask the user to provide the amount. Do not take any default value.
                    **User Guidance:** Make sure the user specifies the correct amount to avoid any transaction errors.
                    **HTML Formatting:** Use HTML to highlight key information and make the instructions clear and easy to follow.
                    `,
					},
					toAddressOrName: {
						type: "string",
						description: `
                    The address or name of the receiver. if name is provided, check contact with the name. If the user does not provide the address or name, leave this field empty.`,
					},
				},
				required: ["amountToSend", "chainName"],
			},
		},
	},
	{
		type: "function",
		function: {
			name: "swapTokens",
			description: "Swap tokens on a chain.",
			parameters: {
				type: "object",
				properties: {
					chainName: {
						type: "string",
						description: `
                    The chain name to swap the tokens. e.g., "eth". If the user does not provide the chain name, you can leave this field empty.
                    **Instructions for SwapTokens Function:**
                    1. **Token Address:** Emphasize using token addresses for swaps rather than names to avoid confusion. However, if a name is provided, pass the name itself.
                    2. **HTML Formatting:** Use HTML to highlight key information and make the instructions clear and easy to follow. For example, use <strong> for emphasis, <ul> for bullet points, and links for resources.
                    Focus on providing precise, actionable advice to encourage users to use token addresses, enhancing the security and accuracy of their transactions.
                    `,
						enum: [
							"eth",
							"Ethereum",
							"mainnet",
							"bsc",
							"Binance Smart Chain",
							"avax",
							"Avalanche",
							"base",
							"Base Network",
							"matic",
							"Polygon",
							"arb",
							"Arbitrum",
							"op",
							"Optimism",
						],
					},
					tokenInNameOrAddress: {
						type: "string",
						description: `
                    The token name or address to swap. Prefer using the token address to avoid confusion, but if a name is provided, pass the name itself. Do not mock the user by generating addresses like **0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0**. If the user does not provide the token name or address, you can leave this field empty.
                    **User Guidance:** Guide users to locate and verify the token addresses they intend to use for the swap. Suggest checking the address against a reliable blockchain explorer.
                    **Error Prevention:** Inform users that specifying the token address ensures the accuracy of the transaction and prevents errors in selecting unintended tokens.
                    **HTML Formatting:** Use HTML to highlight key information and make the instructions clear and easy to follow.
                    **Few-Shot Examples:**
                    **Example 1:**
                        User:"swap 0.01 wbnb to bnb"
                        Assistant: "tokenInNameOrAddress: 'wbnb'"
                    **Example 2:**
                        User: "swap 0.01 0xc2132D05D31c914a87C6611C10748AEb04B58e8F to matic"
                        Assistant: "tokenInNameOrAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'"
                    `,
					},
					amountToSwap: {
						type: "number",
						description: `
                    The amount of the token to swap. e.g., "0.1". If the user does not provide the amount, you can leave this field empty.
                    `,
					},
					tokenOutNameOrAddress: {
						type: "string",
						description: `
                    The coin name or address to swap the token with. Prefer using the coin address to avoid confusion, but if a name is provided, pass the name itself. Do not mock by generating addresses like 0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0. If the user does not provide the coin name or address, you can leave this field empty.
                    **User Guidance:** Guide users to locate and verify the coin addresses they intend to use for the swap. Suggest checking the address against a reliable blockchain explorer.
                    **Error Prevention:** Inform users that specifying the coin address ensures the accuracy of the transaction and prevents errors in selecting unintended coins.
                    **HTML Formatting:** Use HTML to highlight key information and make the instructions clear and easy to follow.
                    **Few-Shot Examples:**
                    **Example 1:**
                        User: "swap 0.01 wbnb to bnb"
                        Assistant: "tokenOutNameOrAddress: 'bnb'"
                    **Example 2:**
                        User: "swap 0.01 matic to 0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
                        Assistant: "tokenOutNameOrAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'"
                    `,
					},
				},
				required: [
					"amountToSwap",
					"tokenInNameOrAddress",
					"tokenOutNameOrAddress",
					"chainName",
				],
			},
		},
	},
] as const;
