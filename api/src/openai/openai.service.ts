import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Model, Types } from "mongoose";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { OpenAI } from "openai";
import { ContactService } from "src/contact/contact.service";
import { UsersService } from "src/users/users.service";
import { DebankService } from "../shared/debank.service";
import { ChatService } from "./chat.service";
import { chatTools } from "./openai.tools";
import { DeFiCronService } from "./defi-cron.service";
import {
	CovalentService,
	chainIdToCoingeckoId,
	chainIdToDebankId,
	chainIdToFullName,
	chainNameToId,
	debankChains,
	supportedNames,
} from "../shared/covalenthq.service";
import { formatGwei } from "viem";
import { User, UserDocument } from "src/users/schema/user.schema";
import { isNativeToken } from "./nativeTokens";
import { OpenOceanService } from "./open-ocean.service";

@Injectable()
export class OpenAiService {
	private openai: OpenAI;
	private tools: any[] = chatTools;

	constructor(
		private configService: ConfigService,
		private usersService: UsersService,
		private chatService: ChatService,
		private debankService: DebankService,
		private contactService: ContactService,
		private defiCronService: DeFiCronService,
		private covalentService: CovalentService,
		private openOceanService: OpenOceanService
	) {
		this.openai = new OpenAI({ apiKey: configService.get("OPENAI_API_KEY") });
	}
	async chat(
		message: string,
		userId: string,
		cId?: string,
		role?: string,
		chainId?: number
	) {
		const user = await this.usersService.findById(userId);
		if (!user) throw new Error("User not found");

		let chatId = cId;
		if (role === "assistant") {
			return this.saveMessageToChat(chatId, {
				role: "assistant",
				content: message,
			});
		}

		if (!chatId) {
			chatId = await this.createChatWithGeneratedTitle(message, userId);
		}
		const chat = (await this.chatService.getChatById(chatId)) as any;
		const recentMessages = this.prepareRecentMessages(chat.messages);
		const isCryptoRelated = await this.isCryptoRelated(recentMessages, message);

		// Filter out non-crypto-related messages using AI-based classification
		if (isCryptoRelated === "non-crypto-related") {
			return this.saveMessageToChat(chatId, {
				role: "assistant",
				content:
					"I am sorry, I prefer assisting with cryptocurrency and blockchain-related queries. Please ask me something related to these topics.",
			});
		}

		if (isCryptoRelated === "general-conversation") {
			return this.generalConversationChat(message, userId, chatId);
		}

		const response = await this.generateChatResponse(
			recentMessages,
			message,
			user.address,
			chainId
		);
		await this.chatService.addMessageToChat(chatId, {
			role: "user",
			content: message,
		});

		return this.handleResponse(response, chatId, user);
	}

	async generalConversationChat(
		message: string,
		userId: string,
		chatId: string
	) {
		const chat = await this.chatService.getChatById(chatId);
		const response = await this.openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					name: "CluBot",
					content: `
									You are CluBot, a state-of-the-art smart wallet assistant developed by Cluster Protocol to assist users with cryptocurrency and blockchain-related inquiries. Your responses should highlight the independent capabilities of Cluster Protocol's technology without referencing external AI technologies or providers.
									**Instructions:**
									1. **Engagement:** Respond to the user's general conversation query in a friendly and engaging manner.
									2. **Professionalism:** Always use a professional and respectful tone.
									3. **Accuracy:** Provide relevant and accurate information. If you don't know the information, don't be afraid to say so.
									4. **Conciseness:** Keep responses concise, with a maximum of 20 words, avoiding unnecessary details.
									5. **Readability:** Use HTML formatting to enhance readability.
									6. **Cluster Protocol:** Explain the purpose of Cluster Protocol and how it can help the user.
							`,
				},
				{ role: "user", content: message },
			],
		});

		const choice = response.choices[0];
		if (choice.finish_reason === "stop" && choice.message.content) {
			return this.saveMessageToChat(chatId, {
				role: "assistant",
				content: choice.message.content,
			});
		}

		return this.saveMessageToChat(chatId, {
			role: "assistant",
			content: "I am sorry, I do not understand what you are asking.",
		});
	}

	async isCryptoRelated(oldChats: any[], message: string) {
		const cryptoKeywords = [
			"bitcoin",
			"ethereum",
			"blockchain",
			"cryptocurrency",
			"crypto",
			"altcoin",
			"token",
			"coin",
			"balance",
			"mining",
			"staking",
			"wallet",
			"transaction",
			"gas",
			"fee",
			"decentralized",
			"exchange",
			"trading",
			"price",
			"chart",
			"market",
			"bull",
			"bear",
			"volatility",
			"hodl",
			"fiat",
			"satoshi",
			"block",
			"confirmation",
			"hash",
			"private key",
			"public key",
			"address",
			"smart contract",
			"dapp",
			"defi",
			"nft",
			"non-fungible token",
			"ico",
			"airdrop",
			"fork",
			"halving",
			"cold storage",
			"hot wallet",
			"paper wallet",
			"seed phrase",
			"metamask",
			"ledger",
			"trezor",
			"coinbase",
			"binance",
			"kraken",
			"gemini",
			"uniswap",
			"pancakeswap",
			"sushiswap",
			"polygon",
			"avalanche",
			"solana",
			"polkadot",
			"cardano",
			"chainlink",
			"stellar",
			"ripple",
			"litecoin",
			"tether",
			"usdc",
			"usdt",
			"dai",
			"wrapped",
			"wbtc",
			"layer 2",
			"rollup",
			"zk-snark",
			"zk-stark",
			"optimistic",
			"arbitrum",
			"loopring",
			"immutable x",
			"starknet",
			"ens",
			"ipfs",
			"filecoin",
			"arweave",
			"gwei",
			"eip",
			"erc20",
			"erc721",
			"erc1155",
			"dao",
			"governance",
			"multisig",
			"timelock",
			"oracle",
			"flash loan",
			"liquidity pool",
			"yield farming",
			"rug pull",
			"pump and dump",
			"fomo",
			"whale",
			"shitcoin",
			"memecoin",
			"gas guzzler",
			"gas limit",
			"gas price",
			"gas war",
			"front-running",
			"sandwich attack",
			"51% attack",
			"double spend",
			"selfish mining",
			"asic",
			"hashrate",
			"difficulty",
			"block reward",
			"block height",
			"merkle tree",
			"merkle root",
			"nonce",
			"zero-knowledge proof",
			"schnorr signature",
			"taproot",
			"segwit",
			"lightning network",
			"atomic swap",
			"cross-chain",
			"interoperability",
			"bridge",
			"wrapped asset",
			"stablecoin",
			"algorithmic stablecoin",
			"seigniorage",
			"rebase",
			"bonding curve",
			"token burn",
			"token mint",
			"token swap",
			"token migration",
			"token unlock",
			"token vesting",
			"token gated",
			"token curated registry",
			"token curated list",
			"fair launch",
			"stealth launch",
			"vampire attack",
			"impermanent loss",
			"slippage",
			"price impact",
			"limit order",
			"market order",
			"stop loss",
			"take profit",
			"margin trading",
			"futures",
			"options",
			"perpetual swap",
			"funding rate",
			"index",
			"portfolio",
			"rebalancing",
			"arbitrage",
			"market making",
			"otc",
			"p2p",
			"kyc",
			"aml",
			"fincen",
			"fatf",
			"travel rule",
			"sanctions",
			"mixer",
			"tumbler",
			"coinjoin",
			"bulletproof",
			"ring signature",
			"confidential transaction",
			"mimblewimble",
			"taproot",
			"dandelion",
			"tor",
			"i2p",
			"vpn",
		];
		const conversationalPhrases = [
			"how are you",
			"who are you",
			"what's up",
			"hi",
			"hello",
			"good morning",
			"good evening",
			"good night",
			"how's it going",
			"what's new",
			"what's happening",
			"how's life",
			"how's everything",
			"how's your day",
		];

		const response = await this.openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					name: "CluBot",
					content: `Classify the following user query into one of three categories: "crypto-related", "general-conversation", or "non-crypto-related":\n\nMessage: "${message}"\n\nClassification:
					some examples of crypto-related keywords: ${cryptoKeywords.join(
						","
					)} some examples of conversational phrases: ${conversationalPhrases.join(
						","
					)}
					Check the message with recent messages to see if it is crypto-related or not. recently messages: ${oldChats.join(
						","
					)}
					`,
				},
				{ role: "user", content: message },
			],
		});
		const choice = response.choices[0];
		console.log(
			"🚀 ~ OpenAiService ~ isCryptoRelated ~ choice.message.content:",
			choice.message.content
		);
		return choice.message.content;
	}

	private async createChatWithGeneratedTitle(
		message: string,
		userId: string
	): Promise<string> {
		const response = await this.openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					name: "CluBot",
					content:
						"Generate a title for the chat based on user input, in 6 to 10 words",
				},
				{ role: "user", content: message },
			],
		});

		const title = response.choices[0].message.content;
		if (!title) throw new Error("Invalid chat title");
		return this.chatService.createChat(new Types.ObjectId(userId), title);
	}

	private prepareRecentMessages(messages: any[]): any[] {
		return messages.slice(-20).map((msg) => {
			let content = msg.content;
			if (msg.extra?.tableString) content += msg.extra.tableString;
			return { role: msg.role, content };
		});
	}

	private async generateChatResponse(
		messages: any[],
		message: string,
		userAddress: string,
		chainId: number
	) {
		const systemIntroduction = (userAddress: string, chainId: number) => `
    You are CluBot, an advanced smart wallet assistant designed by Cluster Protocol to handle cryptocurrency and blockchain-related tasks. The current user's EVM address is ${userAddress},And the current chainId is ${chainId}. You do not rely on external AI technologies but are powered by Cluster Protocol's own innovative solutions.`;

		const clusterProtocolFeatures = `
						Cluster Protocol is a pioneering platform focused on revolutionizing AI model training and execution through decentralization. It embodies a Proof of Compute Protocol and acts as an open-source community for decentralized AI models. Here's a detailed summary of its key features and functions:

				### Key Features and Benefits of Cluster Protocol

				1. **Decentralized AI Training and Execution:**
					 - Cluster Protocol enhances AI development by facilitating model training and execution across distributed networks. This decentralization ensures that resources are utilized efficiently and that AI innovations are accessible to a broader range of developers and researchers.

				2. **Advanced Data Privacy and Security:**
					 - To ensure data privacy, Cluster Protocol employs fully homomorphic encryption, allowing computations to be performed on encrypted data without needing to decrypt it. This ensures that sensitive data remains protected even during processing.
					 - Federated learning is another cornerstone of the protocol, enabling multiple participants to build a common, robust machine learning model without sharing data, thus preserving privacy and reducing data leakage risks.

				3. **Support for Decentralized Datasets and Collaborative Environments:**
					 - The protocol supports decentralized datasets, which means that data storage and management are distributed across various nodes. This reduces central points of failure and enhances data security.
					 - Collaborative model training environments are promoted within the protocol, reducing the barriers to entry for AI development and facilitating a more democratic access to computational resources.

				4. **Monetization of Idle GPU Resources:**
					 - One of the standout features of Cluster Protocol is the "Deploy to Earn" model, which allows users to monetize their idle GPU resources. By contributing their unused computational power, users can earn rewards, thus optimizing resource utilization and generating passive income.

				5. **Proof of Compute:**
					 - Cluster Protocol includes a Proof of Compute mechanism that provides a verifiable way to ensure that computations are performed accurately on the network. This is crucial for maintaining integrity and trust in a decentralized environment, where multiple parties perform computations independently.

				6. **Infrastructure for AI Development:**
					 - The platform offers a robust infrastructure for building and deploying AI applications. This infrastructure supports a wide range of AI activities from model training to deployment, making it a versatile tool for developers.

				7. **Transparent Compute Layer:**
					 - The architecture of Cluster Protocol includes a transparent compute layer that ensures all task processing is verifiable. This transparency is vital in decentralized networks to prevent fraud and ensure that all operations are conducted fairly and correctly.

				### Educational and Practical Applications
				Cluster Protocol is not only an innovative technological solution but also serves as an educational platform that helps in upskilling developers and researchers in the field of AI and blockchain technology. By lowering the entry barriers, it encourages more individuals and organizations to experiment with and develop advanced AI models, fostering a more inclusive and innovative technological landscape.

				For developers interested in integrating or contributing to Cluster Protocol, further details and technical documentation can be found in their [whitepaper](https://cluster-protocol.gitbook.io/whitepaper).

				This comprehensive approach positions Cluster Protocol as a key player in the field of decentralized computing, particularly in areas requiring high standards of data privacy and security, such as healthcare, finance, and governmental sectors.
`;
		const chainIdToFullName: Record<number, string> = {
			1: "eth | Ethereum Mainnet",
			137: "matic | Polygon",
			56: "bsc | Binance Smart Chain",
			142161: "arb | Arbitrum One",
			8453: "base | Base Network",
			43114: "avax | Avalanche C-Chain",
			10: "op | Optimism",
		};
		const blockchainInteraction = (chainId: number) => `
      *Blockchain Interaction:*
      You can execute function calls to access and process blockchain data. Please note these network aliases:
      ${Object.entries(chainIdToFullName)
				.map(([id, name]) => `* ${name}: chainId: ${id}`)
				.join("\n")}
      Only select the user's chain as ${
				chainIdToFullName[chainId]
			} if the chain is not mentioned anywhere in the message.
    `;

		const fewShots = `
						### Few-Shot Examples:

						**For Receive QR Code:**
						**Example 1:**
						**User:** "Get my receive QR code."
						**Assistant:** "Here is your Cluster Receive QR code. You can share it with others to receive payments."

						**Example 2:**
						**User:** "Get my QR Code"
						**Assistant:** "You can find your Cluster Receive QR code below:"

						**Example 3:**
						**User:** "How can I receive tokens?"
						**Assistant:** "Below is your Cluster Receive QR code. Share it with others to receive tokens."

						**Example :**
						**User:** "How can I receive tokens?"
						**Assistant:** "receive"

						**Example 1:**
						**User:** "What is the gas price on Ethereum?"
						**Assistant:** "The current gas price on Ethereum is 50 Gwei. <br/> For more details, visit <a href='https://etherscan.io/gastracker'>Etherscan Gas Tracker</a>."

						**Example 2:**
						**User:** "Add a contact named Alice with address 0x1234..."
						**Assistant:** "Contact 'Alice' with address '0x1234...' has been successfully added to your address book."

						**Example 3:**
						**User:** "Show me my token balances on Binance Smart Chain."
						**Assistant:**
						<ul>
							<li>BNB: 10.5</li>
							<li>CAKE: 200</li>
						</ul>

						**Example 4:**
						**User:** "What's the current price of Ethereum?"
						**Assistant:** According to CoinGecko, the current price of Ethereum (ETH) is $1,850.42. <br/>
						<a href="https://www.coingecko.com/en/coins/ethereum">Check real-time Ethereum price on CoinGecko</a>

						**Example 5:**
						**User:** "Send 0.5 ETH to Alice (0x1234...)"
						**Assistant:** To send 0.5 ETH to Alice (0x1234...), please confirm the following details:
						<ul>
							<li>Recipient: Alice (0x1234...)</li>
							<li>Amount: 0.5 ETH</li>
							<li>Network: Ethereum</li>
						</ul>
						<strong>Please note:</strong> Make sure you have sufficient ETH balance to cover the transaction fee (gas).
						<br/>
						If the details are correct, you can proceed with the transaction. Let me know if you need any further assistance!

						**Example 6:**
						**User:** "Swap 100 USDC for DAI on Polygon"
						**Assistant:** Confirm the address of USDC and DAI on Polygon network.

						**Example 7:**
						**User:** "What's the total value of my NFTs on Ethereum?"
						**Assistant:** Based on the NFTs found in your Ethereum wallet, here's a summary of your NFT portfolio:
						<ul>
							<li>CryptoPunks: 2 NFTs with a total estimated value of 150 ETH</li>
							<li>Bored Ape Yacht Club: 1 NFT with an estimated value of 85 ETH</li>
							<li>Art Blocks: 3 NFTs with a total estimated value of 25 ETH</li>
						</ul>
						<p>The total estimated value of your NFTs on Ethereum is approximately 260 ETH.</p>
						<p>Please note that these values are based on the current market prices and can fluctuate over time.</p>
						<p>Let me know if you need any additional information about your NFT portfolio!</p>

						**Example 8:**
						**User:** "I want to send 0.5 ETH to Bob. His address is 0xabcde..."
						**Assistant:** "You are about to send 0.5 ETH to 0xabcde... <br/> Please confirm the transaction."

						**Example 9:**
						**User:** "What's the price of Bitcoin today?"
						**Assistant:** "Fetching the latest Bitcoin price... <br/> The current price of Bitcoin is $25,800."

						**Example 10:**
						**User:** "Can you list my NFTs on OpenSea?"
						**Assistant:** "I cannot directly list your NFTs on OpenSea. <br/> However, I can provide you with helpful resources and guides on how to do so."

						**Example 11:**
						**User:** "What is the difference between Ethereum and Polygon?"
						**Assistant:** "Both Ethereum and Polygon are blockchain platforms, but they differ in scalability and cost. <br/> Ethereum is more established but has higher fees, while Polygon offers faster and cheaper transactions."

						**Example 12:**
						**User:** "How do I connect my MetaMask wallet?"
						**Assistant:** "I cannot directly connect to your MetaMask wallet due to security reasons. <br/> To manage your wallet, please refer to the MetaMask support documentation."

						**Example 13:**
						**User:** "Compare the gas fees on Ethereum and Binance Smart Chain."
						**Assistant:** "The gas fees on Ethereum are higher than Binance Smart Chain due to network congestion. <br/> BSC offers lower fees but with less decentralization compared to Ethereum."

						**Error Handling and Clarifications:**

						**Example 1:**
						**User:** "snd transaction to 0x12345"
						**Assistant:** "It seems there might be a typo in your request. Could you please confirm the transaction details? Specifically, the recipient's address and the amount you wish to send."

						**Example 2:**
						**User:** "How do I stake my tokens?"
						**Assistant:** "It looks like you're interested in staking your tokens. Could you specify which token you would like to stake, and I can guide you through the process?"

		`;
		const other = () => `

		**Key Principles:**
		1. **User-Focused Interaction:** Address user queries directly with actionable and precise responses.
		2. **Efficiency and Clarity:** Deliver responses succinctly, emphasizing relevance and clarity.
		3. **HTML Enhanced Communication:** Utilize HTML formatting to structure responses, making them easy to read and interact with.

		**Blockchain Interaction:**
		Leverage Cluster Protocol's capabilities to interact with the blockchain, providing users with real-time data and transaction capabilities.
		CluBot is built using modern web technologies like React with TypeScript for the frontend to ensure a responsive and user-friendly interface. It runs on a NestJS backend for efficient server management, with MongoDB for database operations. The AI functionalities are powered by custom models designed for blockchain-specific interactions, while blockchain connectivity is managed through tools like Wagmi and Web3Modal. Security is a top priority, handled through HTTPS and JWT for secure interactions. All services are hosted on AWS to leverage its powerful and scalable cloud capabilities, with Docker ensuring consistent environments across development and production.

		**Available Function Calls:**
		${chatTools
			.map(
				(tool) =>
					`* ${tool.function.name}(${this.getSimplifiedParams(
						tool.function.parameters
					)}): ${tool.function.description}`
			)
			.join("\n")}

			 Always prioritize providing secure, reliable information and maintain a professional demeanor in all interactions. Reflect the capabilities of Cluster Protocol in every response.

				Feel free to COMBINE multiple function calls when appropriate (e.g., compare gas prices across chains, get nft balances on multiple networks, etc.).

				**Data Handling:**
				Never fabricate data; rely on user input and reliable sources. Avoid placeholders; use actual values provided by the user.

				`;
		return await this.openai.chat.completions.create({
			model: "gpt-4-turbo",
			messages: [
				{
					role: "system",
					name: "CluBot",
					content: `
					${systemIntroduction(userAddress, chainId)}
            ${clusterProtocolFeatures}
            ${blockchainInteraction(chainId)}
						${fewShots}
						${other()}
						Note : Make the Response is short and clear, and always use HTML tags for better readability.
						**Tool Calls:**
						1. sendTransaction has contact searching capability. If the user provides a contact name, don't use native getContacts function call. Instead you can use sendTransaction function call with the contact name as the toAddressOrName parameter.
						**Data Handling:**
				  **Never Fabricate Data:** Do not generate information not provided by the user or reliable sources.
				  **Avoid Placeholders:** If relevant, directly include values provided by the user instead of generic placeholders (e.g., use the actual token address).
						`,
				},
				...messages,
				{ role: "user", content: message },
			],
			tools: chatTools,
			frequency_penalty: 0.7,
			presence_penalty: -0.1,
			top_p: 0.3,
			temperature: 0.6,
		});
	}
	private async handleResponse(response: any, chatId: string, user: User) {
		const choice = response.choices[0];
		if (choice.finish_reason === "stop" && choice.message.content) {
			return this.saveMessageToChat(chatId, {
				role: "assistant",
				content: choice.message.content,
			});
		}

		if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
			const toolData = await this.executeToolCalls(
				choice.message.tool_calls,
				user
			);
			return this.processToolResults(toolData, chatId);
		}

		return this.saveMessageToChat(chatId, {
			role: "assistant",
			content: "I am sorry, I do not understand what you are asking.",
		});
	}

	private async executeToolCalls(toolCalls: any[], user: User) {
		console.log(
			"🚀 ~ OpenAiService ~ executeToolCalls ~ toolCalls:",
			toolCalls
		);
		const toolData = [];
		for (const tool of toolCalls) {
			const args = JSON.parse(tool.function.arguments);
			const data = await this[tool.function.name](args, user);
			toolData.push({ function: tool.function.name, arguments: args, data });
		}
		return toolData;
	}

	private async processToolResults(toolData: any[], chatId: string) {
		let text = "Here are the results for the chat:<br/>";
		const chatResponses = [];

		for (const item of toolData) {
			const isCurrentNetwork = item.function === "getCurrentNetwork";
			if (item.data.extra?.table || item.data.extra?.web3Data) {
				chatResponses.push({
					role: "assistant",
					content: item.data.content,
					extra: item.data.extra,
				});
			} else if (isCurrentNetwork) {
				chatResponses.push({
					role: "assistant",
					content: item.data.content,
					extra: item.data.extra,
				});
			} else {
				text += `Function Called: ${
					item.function
				}<br/>Arguments: ${JSON.stringify(item.arguments)}<br/>Result: ${
					item.data.content
				}<br/>`;
			}
		}

		if (text !== "Here are the results for the chat:<br/>") {
			const summaryResponse = await this.generateSummaryResponse(text);
			chatResponses.push({ role: "assistant", content: summaryResponse });
		}

		const savedMessages = [];
		for (const chatResponse of chatResponses) {
			const savedMessage = await this.saveMessageToChat(chatId, chatResponse);
			savedMessages.push(savedMessage);
		}
		return savedMessages;
	}

	private async generateSummaryResponse(text: string) {
		const response = await this.openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					name: "CluBot",
					content: `
									You are CluBot, a smart wallet assistant developed by Cluster Protocol, designed to interact in HTML format for clear communication.
									**Instructions:**
									1. **Clarity:** Provide a very concise and SIMPLE summary of the chat results for the user's reference in simple terms as points and avoid lengthy paragraphs.
									2. **Error Handling:** If there are any errors, apologize and say you are not able to provide the information. But would like to help in other ways.
									3. **Conciseness:** Keep responses really short and focused and to the point, prioritizing clarity and brevity.
									4. **Data Formatting:** Present data in a user-friendly format, such as formatted dates and numbers for easy reading.
									5. **Structured Responses:** Use bullet points and numbered lists to organize information clearly.
									6. **Visual Appeal:** Utilize HTML tags like <p>, <ul>, <li>, <strong>, and <em> to improve readability.
									7. **Direct Address:** Ensure each response directly addresses the user's query or provides the requested information succinctly.
									8. **Practicality:** Ensure responses are practical and directly useful to the user.
									9. **Aesthetics:** Adhere to HTML best practices to enhance the overall user experience.
									NOTE: No Need to show tool call details in the response(function names). And THINK ALWAYS YOU ARE RESPONDING TO A USER ORIENTED **CHAT** BOT RESPONSE.
									don't use this words in the response : summery, abstract and so on.
									**Make it as short as possible**.
							`,
				},
				{ role: "user", content: text },
			],
			temperature: 0.5,
		});

		return response.choices[0].message.content;
	}

	private getSimplifiedParams(parameters: any) {
		return Object.keys(parameters.properties).join(", ");
	}

	private async saveMessageToChat(chatId: string, message: any) {
		await this.chatService.addMessageToChat(chatId, message);
		return { ...message, chatId };
	}

	private async getCurrentNetwork(args: any, user: any) {
		const web3Data = {
			type: "current-network",
		};
		return {
			content: "The current network that you are connected to is: ",
			extra: { web3Data, table: [] },
		};
	}

	private async switchNetwork(args: any, user: any) {
		console.log(
			"🚀 ~ OpenAiService ~ switchNetwork ~ args.newNetwork:",
			args.newNetwork
		);
		if (!args.newNetwork) {
			return {
				content: "Please provide the chain name to change the current chain",
			};
		}
		if (!supportedNames.includes(args.newNetwork)) {
			return {
				content: `Chain name ${args.newNetwork} is not supported`,
			};
		}

		const chainId = chainNameToId[args.newNetwork];
		return {
			content: `Please confirm if you want to switch to the chain ${args.newNetwork}`,
			extra: {
				web3Data: {
					chain: chainId,
					type: "switch-network",
				},
			},
		};
	}

	private async getReceiveQrCode(args: any, user: any) {
		return {
			content:
				"Here is your Cluster Receive QR code. You can share it with others to receive payments.",
			extra: { table: "qr-code", tableString: "" },
		};
	}

	private async getAllBalances(args: any, user: any) {
		if (!args.address && !args.userSearchKey) {
			return {
				content:
					"Please provide the address or contact name to get the balances",
			};
		}
		if (args.address && !args.address.match(/^0x[a-fA-F0-9]{40}$/)) {
			return {
				content:
					"Please provide the valid ethereum address to get the balances",
			};
		}
		if (args.userSearchKey && !args.address) {
			const contacts = await this.contactService.findAllBySearchKey(
				{ address: user.address, id: user.id },
				args.userSearchKey
			);
			if (contacts.length > 1) {
				let tableString = "";
				let index = 1;
				for (const item of contacts) {
					tableString += `id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `;
					// tableString += `No: ${index} id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `
					index++;
				}
				const tableData = contacts.map((item, index) => {
					return {
						// no: {
						// 	title: 'No',
						// 	content: index + 1,
						// 	type: 'text',
						// },
						id: {
							title: "Id",
							content: item.id,
							type: "text",
						},
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						address: {
							title: "Address",
							content: item.address,
							type: "text",
						},
					};
				});
				return {
					content: `Here are the contacts found for the search key ${args.userSearchKey}, choose one to get the balances<br/><br/> `,
					extra: { table: tableData, tableString },
				};
			}
			if (contacts.length === 0) {
				return {
					content: `No contacts found for the search key ${args.userSearchKey} to get the balances`,
				};
			}
			args.address = contacts[0].address;
		}
		if (args.address) {
			const balances: any[] = await this.debankService.getAllBalances(
				args.address
			);

			let filteredBalances = balances.filter((balance) => balance.amount > 0);

			if (args.tokenSearchKey) {
				filteredBalances = filteredBalances.filter((balance) => {
					return (
						balance.name
							.toLowerCase()
							.includes(args.tokenSearchKey.toLowerCase()) ||
						balance.symbol
							.toLowerCase()
							.includes(args.tokenSearchKey.toLowerCase())
					);
				});
			}

			if (args.chainName) {
				const chainId = chainIdToDebankId[chainNameToId[args.chainName]];
				filteredBalances = filteredBalances.filter(
					(balance) => balance.chain === chainId
				);
			}

			if (filteredBalances.length === 0) {
				return {
					content: `No balances found for the user ${args.address}`,
				};
			}

			let tableString = "";
			let index = 1;
			for (const item of filteredBalances) {
				tableString += `No: ${index} Chain: ${item.chain} Name: ${item.name} Symbol: ${item.symbol} Amount: ${item.amount} Price: ${item.price}  tokenAddress: ${item?.id} <br/> `;
				index++;
			}

			const tableData = filteredBalances.map((item, index) => {
				return {
					// no: {
					// 	title: 'No',
					// 	content: index + 1,
					// 	type: 'text',
					// },
					// logo: {
					// 	title: 'Logo',
					// 	content: item.logo_url,
					// 	type: 'image',
					// },
					chain: {
						title: "Chain",
						content: item.chain,
						type: "text",
					},
					name: {
						title: "Name",
						content: item.name,
						type: "text",
					},
					symbol: {
						title: "Symbol",
						content: item.symbol,
						type: "text",
					},
					amount: {
						title: "Amount",
						content: item.amount,
						type: "text",
					},
					price: {
						title: "Price",
						content: item.price,
						type: "text",
					},
				};
			});

			let content = `Here are the balances for the user ${args.address}`;
			if (args.tokenSearchKey) {
				content += ` with token search key ${args.tokenSearchKey}`;
			}
			if (args.chainName) {
				content += ` on chain ${
					chainIdToFullName[chainNameToId[args.chainName]]
				}`;
			}

			return {
				content: `${content} <br/> `,
				extra: { table: tableData, tableString },
			};
		}
		return {
			content: "Please provide the address to get the balances",
		};
	}

	private async getTopHolders(args: any, user: any) {
		if (args.tokenAddress && !args.tokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			return {
				content:
					"Please provide the valid token address to get the top holders",
			};
		}
		if (args.tokenAddress && args.chainName) {
			if (!args.limit) {
				args.limit = 10;
			}
			const chainId = chainIdToDebankId[chainNameToId[args.chainName]];
			const holders: any[] = await this.debankService.getTopHolders(
				args.tokenAddress,
				chainId,
				args.limit
			);

			if (holders.length === 0) {
				return {
					content: `No holders found for the token ${
						args.tokenAddress
					} on chain ${chainIdToFullName[chainNameToId[args.chainName]]}`,
				};
			}

			let tableString = "";
			let index = 1;
			for (const item of holders) {
				tableString += `Rank: ${index} userAddress: ${item[0]} Balance: ${item[1]} <br/> `;
				index++;
			}

			const tableData = holders.map((item, index) => {
				return {
					rank: {
						title: "Rank",
						content: index + 1,
						type: "text",
					},
					address: {
						title: "Address",
						content: item[0],
						type: "text",
					},
					balance: {
						title: "Balance",
						content: item[1],
						type: "text",
					},
				};
			});

			return {
				content: `Here are the top holders for the token ${
					args.tokenAddress
				} on chain ${chainIdToFullName[chainNameToId[args.chainName]]} <br/> `,
				extra: { table: tableData, tableString },
			};
		}
		return {
			content: "Please provide the token and chain to get the top holders",
		};
	}

	private async getNFTsByChain(args: any, user: any) {
		if (!args.address && !args.userSearchKey) {
			return {
				content: "Please provide the address or contact name to get the NFTs",
			};
		}
		if (args.address && !args.address.match(/^0x[a-fA-F0-9]{40}$/)) {
			return {
				content: "Please provide the valid ethereum address to get the NFTs",
			};
		}
		if (args.userSearchKey && !args.address) {
			const contacts = await this.contactService.findAllBySearchKey(
				{ address: user.address, id: user.id },
				args.userSearchKey
			);
			if (contacts.length > 1) {
				let tableString = "";
				let index = 1;
				for (const item of contacts) {
					tableString += `id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `;
					// tableString += `No: ${index} id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `
					index++;
				}
				const tableData = contacts.map((item, index) => {
					return {
						id: {
							title: "Id",
							content: item.id,
							type: "text",
						},
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						address: {
							title: "Address",
							content: item.address,
							type: "text",
						},
					};
				});
				return {
					content: `Here are the contacts found for the search key ${args.userSearchKey}, choose one to get the NFTs balances <br/><br/> `,
					extra: { table: tableData, tableString },
				};
			}
			if (contacts.length === 0) {
				return {
					content: `No contacts found for the search key ${args.userSearchKey} to get the NFTs`,
				};
			}
			args.address = contacts[0].address;
		}
		if (args.address) {
			const chainId = chainNameToId[args.chainName];
			const balances =
				await this.covalentService.getNFTBalancesForWalletAddress({
					chainId,
					userAddress: args.address,
				});

			let filteredBalances = balances.filter(
				(balance) => Number(balance.balance) > 0
			);

			if (args.nftSearchKey) {
				filteredBalances = filteredBalances.filter((balance) => {
					return (
						(balance?.contract_display_name ?? balance.contract_name)
							.toLowerCase()
							.includes(args.tokenSearchKey.toLowerCase()) ||
						balance.contract_name
							.toLowerCase()
							.includes(args.tokenSearchKey.toLowerCase())
					);
				});
			}

			// if (args.chainName) {
			// 	const chainId = chainIdToDebankId[chainNameToId[args.chainName]];
			// 	filteredBalances = filteredBalances.filter(
			// 		(balance) => balance.chain === chainId
			// 	);
			// }

			if (filteredBalances.length === 0) {
				return {
					content: `No NFTs found for the user ${args.address}`,
				};
			}

			let tableString = "";
			let index = 1;
			for (const item of filteredBalances) {
				tableString += `Chain: ${args.chainName} Name: ${
					item.contract_display_name
				} Amount: ${Number(item.balance)} nftContractAddress: ${
					item?.contract_address
				} Price: ${item.quote}
				<br/> `;
				// tableString += `No: ${index} Chain: ${item.chain} Name: ${item.name} Amount: ${item.amount} nftContractAddress: ${item?.contract_id} <br/> `
				index++;
			}

			const tableData = filteredBalances.map((item, index) => {
				return {
					// no: {
					// 	title: 'No',
					// 	content: index + 1,
					// 	type: 'text',
					// },
					name: {
						title: "Name",
						content: item.contract_display_name,
						type: "text",
					},
					image: {
						title: "Image",
						content: item.logo_url,
						type: "image",
					},
					chain: {
						title: "Chain",
						content: args.chainName,
						type: "text",
					},
					amount: {
						title: "Amount",
						content: Number(item.balance),
						type: "text",
					},
					quote: {
						title: "Price",
						content: item?.quote ?? "N/A",
						type: "text",
					},
				};
			});

			let content = `Here are the balances for the user ${args.address}`;
			if (args.nftSearchKey) {
				content += ` with token search key ${args.nftSearchKey}`;
			}
			if (args.chainName) {
				content += ` on chain ${
					chainIdToFullName[chainNameToId[args.chainName]]
				}`;
			}

			return {
				content: `${content} <br/> `,
				extra: { table: tableData, tableString },
			};
		}
		return {
			content: "Please provide the address to get the NFTs",
		};
	}

	private async getGasPrice(args: any, user: any) {
		if (args.chainName) {
			try {
				const chainId = chainNameToId[args.chainName];
				const gasPrice = await this.covalentService.getGasPrice(chainId);

				const data = {
					updatedAt: gasPrice.updated_at,
					gasFee:
						gasPrice.base_fee &&
						`${Number.parseFloat(formatGwei(BigInt(gasPrice.base_fee))).toFixed(
							2
						)} Gwei`,
					erc20Fee: gasPrice.items[0].pretty_total_gas_quote,
				};

				return {
					content: `Here is the gas price for the chain ${
						chainIdToFullName[chainId]
					} <br/> ${JSON.stringify(data)}`,
				};
			} catch (error) {
				return {
					content: `Error: ${error.message}`,
				};
			}
		}
		return {
			content: "Please provide the chain to get the gas price",
		};
	}

	private async addContact(args: any, user: any) {
		if (!args.address && !args.name) {
			console.log("args.address 1", args.address);
			return {
				content: "Please provide the name and address to add the contact",
			};
		}
		if (!args.address) {
			console.log("args.address  2", args.address);
			return {
				content: "Please provide the address to add the contact",
			};
		}
		if (!args.name) {
			console.log("args.address 3", args.address);
			return {
				content: "Please provide the name to add the contact",
			};
		}
		if (args.address && !args.address.match(/^0x[a-fA-F0-9]{40}$/)) {
			console.log("args.address 4", args.address);
			return {
				content: "Please provide the valid ethereum address to add the contact",
			};
		}
		try {
			console.log("args.address 5", args.address);
			console.log("args.address 5", user);

			await this.contactService.create(
				{ address: user.address, id: user.id },
				{ name: args.name, address: args.address }
			);
			return {
				content: "Contact added successfully",
			};
		} catch (error) {
			return {
				content: `Error: ${error.message}`,
			};
		}
	}

	private async removeContact(args: any, user: any) {
		let contacts = [];

		if (args.searchkey) {
			contacts = await this.contactService.findAllBySearchKey(
				{ address: user.address, id: user.id },
				args.searchkey
			);

			if (contacts.length > 1) {
				const tableObj = contacts.map((item, index) => {
					return {
						no: index + 1,
						id: item.id,
						name: item.name,
						address: item.address,
					};
				});

				let tableString = "";
				for (const item of contacts) {
					tableString += `id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `;
					// tableString += `No: ${item.no} id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `
				}

				const tableData = contacts.map((item, index) => {
					return {
						// no: {
						// 	title: 'No',
						// 	content: index + 1,
						// 	type: 'text',
						// },
						id: {
							title: "Id",
							content: item.id,
							type: "text",
						},
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						address: {
							title: "Address",
							content: item.address,
							type: "text",
						},
					};
				});
				return {
					content: `Here are the contacts found for the search key ${args.searchkey}, choose one to remove<br/><br/> `,
					extra: { table: tableData, tableObj, tableString },
				};
			}
			if (contacts.length === 0) {
				return {
					content: `No contacts found for the search key ${args.searchkey} to remove`,
				};
			}
		}
		if (args.id || contacts.length === 1) {
			args.id = args.id || contacts[0].id;
			try {
				await this.contactService.remove(
					{ address: user.address, id: user.id },
					args.id
				);
				return {
					content: "Contact removed successfully",
				};
			} catch (error) {
				return {
					content: `Error: ${error.message}`,
				};
			}
		}
		return {
			content: "Please provide the search key or id to remove the contact",
		};
	}

	private async getContacts(args: any, user: any) {
		let contacts = [];
		if (args.searchkey) {
			contacts = await this.contactService.findAllBySearchKey(
				{ address: user.address, id: user.id },
				args.searchkey
			);
		} else {
			contacts = await this.contactService.findAll({
				address: user.address,
				id: user.id,
			});
		}
		if (contacts.length > 0) {
			let tableString = "";
			let index = 1;
			for (const item of contacts) {
				tableString += `Name: ${item.name} Address: ${item.address} <br/> `;
				// tableString += `No: ${index} id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `
				index++;
			}
			const tableData = contacts.map((item, index) => {
				return {
					// no: {
					// 	title: 'No',
					// 	content: index + 1,
					// 	type: 'text',
					// },
					// id: {
					// 	title: "Id",
					// 	content: item.id,
					// 	type: "text",
					// },
					name: {
						title: "Name",
						content: item.name,
						type: "text",
					},
					address: {
						title: "Address",
						content: item.address,
						type: "text",
					},
				};
			});
			if (args.searchkey) {
				return {
					role: "assistant",
					content: `Here are the contacts found for the search key ${args.searchkey} <br/><br/>`,
					extra: { table: tableData, tableString },
				};
			}
			return {
				role: "assistant",
				content: "Here are the contacts for the user <br/><br/>",
				extra: { table: tableData, tableString },
			};
		}
		if (args.searchkey) {
			return {
				content: `No contacts found for the search key ${args.searchkey}`,
			};
		}
		return {
			content: "No contacts found for the user",
		};
	}

	private async updateContact(args: any, user: any) {
		if (!args.id && !args.searchkey) {
			return {
				content: "Please provide the search key or id to update the contact",
			};
		}
		if (!args.nameToUpdate && !args.addressToUpdate) {
			return {
				content: "Please provide the name or address to update the contact",
			};
		}
		let contacts = [];
		if (args.searchkey && !args.id) {
			contacts = await this.contactService.findAllBySearchKey(
				{ address: user.address, id: user.id },
				args.searchkey
			);

			if (contacts.length > 1) {
				let tableString = "";
				let index = 1;
				for (const item of contacts) {
					tableString += `id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `;
					// tableString += `No: ${index} id: ${item.id} Name: ${item.name} Address: ${item.address} <br/> `
					index++;
				}
				const tableData = contacts.map((item, index) => {
					return {
						// no: {
						// 	title: 'No',
						// 	content: index + 1,
						// 	type: 'text',
						// },
						id: {
							title: "Id",
							content: item.id,
							type: "text",
						},
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						address: {
							title: "Address",
							content: item.address,
							type: "text",
						},
					};
				});

				return {
					role: "assistant",
					content: `Here are the contacts found for the search key ${args.searchkey}, choose one to update<br/><br/> `,
					extra: { table: tableData, tableString },
				};
			}
			if (contacts.length === 1) {
				args.id = contacts[0].id;
			}
		}
		if (args.id) {
			let updateData = {};
			if (args.nameToUpdate) {
				updateData = { name: args.nameToUpdate };
			}
			if (args.addressToUpdate) {
				updateData = { address: args.addressToUpdate };
			}
			try {
				await this.contactService.update(
					{ address: user.address, id: user.id },
					args.id,
					updateData
				);
				return {
					content: "Contact updated successfully with the provided data",
				};
			} catch (error) {
				return {
					content: `Error: ${error.message}`,
				};
			}
		}
		return {
			role: "assistant",
			content: `No contacts found for the search key ${args.searchkey} to update`,
		};
	}

	async sendTransaction(args: any, user: any) {
		console.log("🚀 ~ OpenAiService ~ sendTransaction ~ args:", args);
		if (!args.chainName || !supportedNames.includes(args.chainName)) {
			return {
				content:
					"Please provide the valid chain to send the transaction <br/> here are the supported chains <br/> ethereum, binance smart chain, avalanche, polygon, arbitrum, optimism, base",
			};
		}
		if (!args.toAddressOrName) {
			return {
				content:
					"Please provide the valid to address or name to send the transaction",
			};
		}
		if (!args.amountToSend) {
			return {
				content: "Please provide the valid amount to send the transaction",
			};
		}
		if (!args.coinNameOrAddress) {
			return {
				content:
					"Please provide the valid coin name or address to send the transaction",
			};
		}

		if (args.toAddressOrName?.match(/^0x[a-fA-F0-9]{40}$/)) {
			args.toAddress = args.toAddressOrName;
		}

		if (args.coinNameOrAddress?.match(/^0x[a-fA-F0-9]{40}$/)) {
			args.tokenAddress = args.coinNameOrAddress;
		}

		if (args.toAddressOrName && !args.toAddress) {
			const contacts = await this.contactService.findAllBySearchKey(
				{ address: user.address, id: user.id },
				args.toAddressOrName
			);
			if (contacts.length > 1) {
				let tableString = "";
				let index = 1;
				for (const item of contacts) {
					// tableString += `No: ${index} id: ${item.id} Name: ${item.name} toAddress: ${item.address} <br/> `
					tableString += `id: ${item.id} Name: ${item.name} toAddress: ${item.address} <br/> `;
					index++;
				}
				const tableData = contacts.map((item, index) => {
					return {
						// no: {
						// 	title: 'No',
						// 	content: index + 1,
						// 	type: 'text',
						// },
						id: {
							title: "Id",
							content: item.id,
							type: "text",
						},
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						address: {
							title: "Address",
							content: item.address,
							type: "text",
						},
					};
				});
				return {
					content: `Here are the contacts found for the search key ${args.toAddressOrName}, choose one to send the transaction <br/><br/> `,
					extra: { table: tableData, tableString },
				};
			}
			if (contacts.length === 0) {
				return {
					content: `No contacts found for the search key ${args.toAddressOrName} to send the transaction`,
				};
			}
			args.toAddress = contacts[0].address;
		}
		if (args.coinNameOrAddress && !args.tokenAddress) {
			const balances: any[] = await this.debankService.getAllBalances(
				user.address
			);

			const debankChainId = chainIdToDebankId[chainNameToId[args.chainName]];

			const filteredBalances = balances
				.filter((balance) => {
					return (
						balance.amount > 0 &&
						balance.chain === debankChainId &&
						(balance.name
							.toLowerCase()
							.includes(args.coinNameOrAddress.toLowerCase()) ||
							balance.symbol
								.toLowerCase()
								.includes(args.coinNameOrAddress.toLowerCase()))
					);
				})
				.map((item) => {
					if (item.id === debankChainId) {
						item.id = "0x0000000000000000000000000000000000000000";
					}
					return {
						id: item.id,
						name: item.name,
						symbol: item.symbol,
					};
				});

			if (filteredBalances.length === 0) {
				return {
					content:
						"No balances found for the user to send the transaction <br/> if you want to send the transaction with the token address, please provide the valid token address",
				};
			}

			if (filteredBalances.length > 1) {
				let tableString = "";
				let index = 1;
				for (const item of filteredBalances) {
					tableString += `coinAddress: ${item.id} Name: ${item.name} Symbol: ${item.symbol} <br/> `;
					// tableString += `No: ${index} coinAddress: ${item.id} Name: ${item.name} Symbol: ${item.symbol} <br/> `
					index++;
				}
				const tableData = filteredBalances.map((item, index) => {
					if (isNativeToken(item.id)) {
						item.id = "native";
					}
					return {
						// no: {
						// 	title: 'No',
						// 	content: index + 1,
						// 	type: 'text',
						// },
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						symbol: {
							title: "Symbol",
							content: item.symbol,
							type: "text",
						},
						tokenAddress: {
							title: "Token Address",
							content: item.id,
							type: "text",
						},
					};
				});
				return {
					content: `Here are the coins found for the search key ${args.coinNameOrAddress}, choose one to send the transaction <br/><br/> `,
					extra: { table: tableData, tableString },
				};
			}
			args.tokenAddress = filteredBalances[0].id;
		}

		if (args.toAddress && args.amountToSend && args.tokenAddress) {
			let web3Data: any;
			if (isNativeToken(args.tokenAddress)) {
				web3Data = {
					chain: chainIdToCoingeckoId[chainNameToId[args.chainName]],
					to: args.toAddress,
					amount: args.amountToSend,
					type: "send-native",
				};
			} else {
				web3Data = {
					chain: chainIdToCoingeckoId[chainNameToId[args.chainName]],
					to: args.toAddress,
					amount: args.amountToSend,
					tokenAddress: args.tokenAddress,
					type: "send-token",
				};
			}

			return {
				content: `Here are the details for the transaction <br/>
				Chain: ${args.chainName} <br/>
				To: ${args.toAddress} <br/>
				Amount: ${args.amountToSend} <br/>
				Token Address: ${
					isNativeToken(args.tokenAddress) ? "native" : args.tokenAddress
				} <br/><br/>
				Please confirm the transaction`,
				extra: { web3Data, table: [] },
			};
		}
		return {
			content:
				"Please provide the valid to address, amount and coin to send the transaction",
		};
	}

	async swapTokens(args: any, user: any) {
		console.log("🚀 ~ OpenAiService ~ swapTokens ~ args:", args);
		if (!args?.chainName || !supportedNames?.includes(args.chainName)) {
			return {
				content:
					"Please provide the valid chain to swap the token <br/> here are the supported chains <br/> ethereum, binance smart chain, avalanche, polygon, arbitrum, optimism, base",
			};
		}
		if (!args?.tokenInNameOrAddress) {
			return {
				content:
					"Please provide the valid token in name or address to swap the token",
			};
		}
		if (!args?.tokenOutNameOrAddress) {
			return {
				content:
					"Please provide the valid token out name or address to swap the token",
			};
		}
		if (!args?.amountToSwap) {
			return {
				content: "Please provide the valid amount to swap the token",
			};
		}

		if (args.tokenInNameOrAddress?.match(/^0x[a-fA-F0-9]{40}$/)) {
			args.tokenInAddress = args.tokenInNameOrAddress;
		}

		if (args.tokenOutNameOrAddress?.match(/^0x[a-fA-F0-9]{40}$/)) {
			args.tokenOutAddress = args.tokenOutNameOrAddress;
		}

		if (args.tokenInNameOrAddress && !args.tokenInAddress) {
			const balances = await this.debankService.getAllBalances(user.address);

			const debankChainId = chainIdToDebankId[chainNameToId[args.chainName]];

			const filteredBalances = balances
				.filter((balance) => {
					return (
						balance.amount > 0 &&
						balance.chain === debankChainId &&
						(balance.name
							.toLowerCase()
							.includes(args.tokenInNameOrAddress.toLowerCase()) ||
							balance.symbol
								.toLowerCase()
								.includes(args.tokenInNameOrAddress.toLowerCase()))
					);
				})
				.map((item) => {
					const newItem = { ...item };
					if (newItem.id === debankChainId) {
						newItem.id = "0x0000000000000000000000000000000000000000";
					}
					return {
						id: newItem.id,
						name: newItem.name,
						symbol: newItem.symbol,
					};
				});

			if (filteredBalances.length === 0) {
				return {
					content: `No balances found for the user to swap the token in with key ${
						args.tokenInNameOrAddress
					} on chain ${
						chainIdToFullName[chainNameToId[args.chainName]]
					} <br/> if you want to swap the token with the token address, please provide the valid token address`,
				};
			}
			if (filteredBalances.length > 1) {
				let tableString = "";
				let index = 1;
				for (const item of filteredBalances) {
					tableString += `tokenInAddress: ${item.id} Name: ${item.name} Symbol: ${item.symbol} <br/> `;
					// tableString += `No: ${index} tokenInAddress: ${item.id} Name: ${item.name} Symbol: ${item.symbol} <br/> `
					index++;
				}
				const tableData = filteredBalances.map((item, index) => {
					if (isNativeToken(item.id)) {
						item.id = "native";
					}
					return {
						// no: {
						// 	title: 'No',
						// 	content: index + 1,
						// 	type: 'text',
						// },
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						symbol: {
							title: "Symbol",
							content: item.symbol,
							type: "text",
						},
						tokenAddress: {
							title: "Token Address",
							content: item.id,
							type: "text",
						},
					};
				});
				return {
					content: `Here are the coins found for your search term  <b>${args.tokenInNameOrAddress}</b>. Please select one to swap your token with:<br/><br/>`,
					extra: { table: tableData, tableString },
				};
			}
			args.tokenInAddress = filteredBalances[0].id;
		}

		if (args.tokenOutNameOrAddress && !args.tokenOutAddress) {
			const coins = await this.defiCronService.searchOnDefiData(
				"coingecko",
				"token",
				{
					$or: [
						{
							"data.name": {
								$regex: args.tokenOutNameOrAddress,
								$options: "i",
							},
						},
						{
							"data.symbol": {
								$regex: args.tokenOutNameOrAddress,
								$options: "i",
							},
						},
					],
				}
			);
			const chainToCoinIdMap = {
				ethereum: "ethereum",
				"binance-smart-chain": "binancecoin",
				avalanche: "avalanche-2",
				"polygon-pos": "matic-network",
				"arbitrum-one": "ethereum",
				"optimistic-ethereum": "ethereum",
				base: "ethereum",
			};
			let filteredTokens = coins
				.filter((item) => {
					return (
						item.defiId ===
							chainToCoinIdMap[
								chainIdToCoingeckoId[chainNameToId[args.chainName]]
							] ||
						item.data.get("platforms")?.[
							chainIdToCoingeckoId[chainNameToId[args.chainName]]
						]
					);
				})
				.map((item) => {
					if (
						item.defiId ===
						chainToCoinIdMap[
							chainIdToCoingeckoId[chainNameToId[args.chainName]]
						]
					) {
						return {
							id: item.defiId,
							name: item.data.get("name"),
							symbol: item.data.get("symbol"),
							tokenAddress: "0x0000000000000000000000000000000000000000",
						};
					}
					return {
						id: item.defiId,
						name: item.data.get("name"),
						symbol: item.data.get("symbol"),
						tokenAddress:
							item.data.get("platforms")?.[
								chainIdToCoingeckoId[chainNameToId[args.chainName]]
							],
					};
				});

			if (filteredTokens?.length === 0) {
				return {
					content: `No token found for the name ${
						args.tokenOutNameOrAddress
					} to swap the token out on chain ${
						chainIdToFullName[chainNameToId[args.chainName]]
					} <br/> if you want to swap the token with the token address, please provide the valid token address`,
				};
			}

			filteredTokens = await this.getBestTokenList(
				args.tokenOutNameOrAddress,
				args.tokenInNameOrAddress,
				filteredTokens
			);

			if (filteredTokens?.length > 1) {
				let tableString = "";
				let index = 1;
				for (const item of filteredTokens) {
					tableString += `tokenOutAddress: ${item.tokenAddress} Name: ${item.name} Symbol: ${item.symbol} <br/> `;
					// tableString += `No: ${index} tokenOutAddress: ${item.tokenAddress} Name: ${item.name} Symbol: ${item.symbol} <br/> `
					index++;
				}
				const tableData = filteredTokens.map((item, index) => {
					if (isNativeToken(item.tokenAddress)) {
						item.tokenAddress = "native";
					}
					return {
						// no: {
						// 	title: 'No',
						// 	content: index + 1,
						// 	type: 'text',
						// },
						name: {
							title: "Name",
							content: item.name,
							type: "text",
						},
						symbol: {
							title: "Symbol",
							content: item.symbol,
							type: "text",
						},
						tokenAddress: {
							title: "Token Address",
							content: item.tokenAddress,
							type: "text",
						},
					};
				});
				return {
					content: `Here are the tokens found for the name ${args.tokenOutNameOrAddress}, choose one to swap the token out <br/><br/> `,
					extra: { table: tableData, tableString },
				};
			}
			args.tokenOutAddress = filteredTokens[0].tokenAddress;
		}

		if (args.tokenInAddress && args.amountToSwap && args.tokenOutAddress) {
			const web3Data = {
				chain: chainIdToCoingeckoId[chainNameToId[args.chainName]],
				tokenIn: isNativeToken(args.tokenInAddress)
					? "native"
					: args.tokenInAddress,
				tokenOut: isNativeToken(args.tokenOutAddress)
					? "native"
					: args.tokenOutAddress,
				isNativeTokenIn: isNativeToken(args.tokenInAddress),
				isNativeTokenOut: isNativeToken(args.tokenOutAddress),
				amount: args.amountToSwap,
				type: "swap-tokens",
			};

			// Find the token Name, Symbol, Decimals and Chain
			const tokenIn = await this.defiCronService.searchOnDefiData(
				"coingecko",
				"token",
				{ defiId: args.tokenInAddress }
			);
			// Find the token Name, Symbol, Decimals and Chain
			const tokenOut = await this.defiCronService.searchOnDefiData(
				"coingecko",
				"token",
				{ defiId: args.tokenOutAddress }
			);
			console.log("🚀 ~ OpenAiService ~ swapTokens ~ tokenIn:", tokenOut);

			return {
				content: `Here are the details for the swap transaction <br/>
					Chain: ${chainIdToFullName[chainNameToId[args.chainName]]} <br/>
					Token In: ${
						isNativeToken(args.tokenInAddress) ? "native" : args.tokenInAddress
					} <br/>
					Token Out: ${
						isNativeToken(args.tokenOutAddress)
							? "native"
							: args.tokenOutAddress
					} <br/>
					Amount: ${args.amountToSwap} <br/><br/>
					Please confirm the transaction`,
				extra: { web3Data, table: [] },
			};
		}

		return {
			content:
				"Please provide the valid token in, token out and amount to swap the token",
		};
	}

	private async getTokenOrProtocolDetails(args: any, user: any) {
		console.log("🚀 ~ OpenAiService ~ getTokenOrProtocolDetails ~ args:", args);
		let coins = [];
		let protocols = [];
		if (!args.defiId && !args.coinOrProtocolName) {
			return {
				role: "assistant",
				content:
					"Please provide the coin or protocol name to fetch the details",
			};
		}
		if (
			(args.queryType === "coin" || !args.queryType) &&
			args.coinOrProtocolName &&
			!args.defiId
		) {
			coins = await this.defiCronService.searchOnDefiData(
				"coingecko",
				"token",
				{
					$or: [
						{ "data.name": { $regex: args.coinOrProtocolName, $options: "i" } },
						{
							"data.symbol": { $regex: args.coinOrProtocolName, $options: "i" },
						},
					],
				}
			);
		} else if (
			(args.queryType === "protocol" || !args.queryType) &&
			args.coinOrProtocolName &&
			!args.defiId
		) {
			protocols = await this.defiCronService.searchOnDefiData(
				"defillama",
				"protocol",
				{ "data.name": { $regex: args.coinOrProtocolName, $options: "i" } }
			);
		}

		if (args.defiId) {
			coins = await this.defiCronService.searchOnDefiData(
				"coingecko",
				"token",
				{ defiId: args.defiId }
			);
			protocols = await this.defiCronService.searchOnDefiData(
				"defillama",
				"protocol",
				{ defiId: args.defiId }
			);
		}

		let length = coins.length + protocols.length;

		if (length === 0) {
			return {
				role: "assistant",
				content: `No coin or protocol found for the search key ${args.coinOrProtocolName}`,
			};
		}
		// if (length > 1) {
		// 	const { object } = await generateObject({
		// 		model: openai("gpt-4o"),
		// 		prompt: `Given the following coins and protocols:
		//     ${coins.map((coin) => `- ${coin.name} (${coin.symbol})`).join("\n")}
		//     ${protocols
		// 			.map((protocol) => `- ${protocol.name} (${protocol.symbol})`)
		// 			.join("\n")}
		//     ${args.coinOrProtocolName}
		//     generate the best token list for ${
		// 			args.coinOrProtocolName
		// 		}, The list should contain between 1 to 7 tokens and include the following properties for each token:
		//     - id: Token ID
		//     - name: Token Name
		//     - symbol: Token Symbol
		//     - tokenAddress: Token Address
		//     Ensure the selected tokens are the most relevant and optimal for ${
		// 			args.coinOrProtocolName
		// 		}. Sort based on balance
		//     `,
		// 		schema: z.object({
		// 			list: z
		// 				.array(
		// 					z.object({
		// 						defiId: z.string().describe("defiId"),
		// 						name: z.string().describe("name"),
		// 						symbol: z.string().describe("symbol"),
		// 						type: z.enum(["coin", "protocol"]).describe("type"),
		// 					})
		// 				)
		// 				.min(1),
		// 		}),
		// 	});
		// }

		if (length > 1) {
			const tableObj: {
				defiId: string;
				name: string;
				symbol: string;
				type: string;
				no: number;
			}[] = coins.map((item, index) => {
				return {
					no: index + 1,
					defiId: item.defiId,
					type: "coin",
					name: item.data.get("name"),
					symbol: item.data.get("symbol"),
				};
			});
			tableObj.push(
				...protocols.map((item, index) => {
					return {
						no: index + 1 + coins.length,
						defiId: item.defiId,
						type: "protocol",
						name: item.data.get("name"),
						symbol: item.data.get("symbol"),
					};
				})
			);

			let type = 0;
			if (coins.length > 0 && protocols.length > 0) {
				type = 1;
			} else if (coins.length > 0) {
				type = 2;
			} else {
				type = 3;
			}

			let tableString = "";
			for (const item of tableObj) {
				tableString += `defiId: ${item?.defiId} Name: ${item.name} Symbol: ${item.symbol} <br/>`;
				// tableString += `No: ${item.no} defiId: ${item?.defiId} Name: ${item.name} Symbol: ${item.symbol} <br/>`
			}

			let tableData: any[] = tableObj.map((item, index) => {
				return {
					// no: {
					// 	title: 'No',
					// 	content: index + 1,
					// 	type: 'text',
					// },
					type: {
						title: "Type",
						content: item.type,
						type: "text",
					},
					name: {
						title: "Name",
						content: item.name,
						type: "text",
					},
					symbol: {
						title: "Symbol",
						content: item.symbol,
						type: "text",
					},
				};
			});

			if (type === 2 || type === 3) {
				tableData = tableData.map((item, index) => {
					return {
						no: item.no,
						name: item.name,
						symbol: item.symbol,
					};
				});
			}

			let searchType = "";
			if (type === 1) {
				searchType = "coin or protocol";
			} else if (type === 2) {
				searchType = "coin";
			} else {
				searchType = "protocol";
			}

			return {
				role: "assistant",
				content: `Here are the list of ${searchType} found for the search key ${args.coinOrProtocolName}, choose one <br/><br/>`,
				extra: { table: tableData, tableObj, tableString },
			};
		}

		if (coins.length === 1 || protocols.length === 1 || args.defiId) {
			if (coins.length === 1) {
				try {
					const result = await this.defiCronService.fetchCoinGeckoTokenById(
						coins[0].defiId
					);
					console.log(
						"🚀 ~ OpenAiService ~ getTokenOrProtocolDetails ~ result:",
						result
					);

					const data = {
						symbol: result?.symbol,
						name: result?.name,
						description: result?.description?.en,
						links: {
							homepage: result?.links?.homepage?.[0],
							whitepaper:
								result?.links?.whitepaper?.length &&
								result?.links?.whitepaper?.filter(Boolean),
							announcementUrl: result?.links?.announcement_url,
							twitter: `https://twitter.com/${result?.twitter_screen_name}`,
							facebook: `https://facebook.com/${result?.facebook_username}`,
							telegram: `https://t.me/${result?.telegram_channel_identifier}`,
							subreddit: `https://reddit.com/r/${result?.subreddit}`,
							github: result?.repos_url?.github?.[0],
						},
						images: {
							thumb: result?.image?.thumb,
							small: result?.image?.small,
							large: result?.image?.large,
						},

						genesisDate: result?.genesis_date,
						marketCapRank: result?.market_cap_rank,
						marketData: {
							currentPrice: result?.market_data?.current_price?.usd,
							marketCap: result?.market_data?.market_cap?.usd,
							totalVolume: result?.market_data?.total_volume?.usd,
							high24h: result?.market_data?.high_24h,
							low24h: result?.market_data?.low_24h,
							circulatingSupply: result?.market_data?.circulating_supply,
							totalSupply: result?.market_data?.total_supply,
							maxSupply: result?.market_data?.max_supply,
						},
					};

					return {
						role: "assistant",
						content: `Here are the details fetched for the coin ${
							data.name
						} <br/><br/> ${JSON.stringify(data)}`,
					};
				} catch (e) {
					return {
						role: "assistant",
						content: `Error: ${e.message}`,
					};
				}
			}
			if (protocols.length === 1) {
				try {
					const result = protocols[0].data;
					const data = {
						name: result?.get("name"),
						description: result?.get("description"),
						links: {
							homepage: result?.get("url"),
							twitter: `https://twitter.com/${result?.get("twitter")}`,
							github: result?.get("github")?.[0],
						},
						images: {
							logo: result?.get("logo"),
						},
						symbol: result?.get("symbol"),
						supportedChains: result?.get("chains"),
						slug: result?.get("slug"),
						// biome-ignore lint/style/useNamingConvention: <explanation>
						TVL: Number.parseFloat(
							result?.get("tvl") === 0
								? "TVL not available at the moment"
								: `$ ${Number.parseFloat(result?.get("tvl"))?.toFixed(2)}`
						),
						// biome-ignore lint/style/useNamingConvention: <explanation>
						chainTVLs: result?.get("chainTVls"),
					};
					return {
						role: "assistant",
						content: `Here are the details fetched for the protocol ${
							data.name
						} <br/><br/> ${JSON.stringify(data)}`,
					};
				} catch (e) {
					return {
						role: "assistant",
						content: `Error: ${e.message}`,
					};
				}
			}
		}
	}

	private async getBestTokenList(
		key: string,
		ignoreKey: string,
		tokens: {
			id: string;
			name: string;
			symbol: string;
			tokenAddress?: string;
		}[]
	) {
		const { object } = await generateObject({
			model: openai("gpt-4o"),
			prompt: `Given the following tokens: ${JSON.stringify(tokens)},
        generate the best token list for ${key}, ignoring any tokens with the key ${ignoreKey}. The list should contain between 1 to 7 tokens and include the following properties for each token:
        - id: Token ID
        - name: Token Name
        - symbol: Token Symbol
        - tokenAddress: Token Address
        Ensure the selected tokens are the most relevant and optimal for ${key}. Sort the tokens in the list by their relevance to ${key}.`,
			schema: z.object({
				tokens: z
					.array(
						z.object({
							id: z.string().describe("token id"),
							name: z.string().describe("token name"),
							symbol: z.string().describe("token symbol"),
							tokenAddress: z.string().describe("token address"),
						})
					)
					.min(1),
			}),
		});

		return object.tokens as unknown as {
			id: string;
			name: string;
			symbol: string;
			tokenAddress: string;
		}[];
	}
}
