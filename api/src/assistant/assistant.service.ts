import { openai } from "@ai-sdk/openai";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { generateObject } from "ai";
import { Model, Types } from "mongoose";
import { OpenAI } from "openai";
import { ContactService } from "src/contact/contact.service";
import {
	Context,
	ContextDocument,
} from "src/context-seeder/entities/context.entity";
import { ChatService } from "src/openai/chat.service";
import { DeFiCronService } from "src/openai/defi-cron.service";
import { isNativeToken } from "src/openai/nativeTokens";
import {
	CovalentService,
	chainIdToCoingeckoId,
	chainIdToDebankId,
	chainIdToFullName,
	chainNameToId,
	chainNameToNativeAddress,
	supportedNames,
} from "src/shared/covalenthq.service";
import { DebankService } from "src/shared/debank.service";
import { ReqUser } from "src/users/schema/user.schema";
import { UsersService } from "src/users/users.service";
import { formatGwei } from "viem";
import { z } from "zod";
import { customTools } from "./custom-tools";

@Injectable()
export class AssistantService {
	private openai: OpenAI;
	constructor(
		private usersService: UsersService,
		private contactService: ContactService,
		private debankService: DebankService,
		private covalentService: CovalentService,
		private defiCronService: DeFiCronService,
		private configService: ConfigService,
		private chatService: ChatService,
		@InjectModel(Context.name)
		private contextModel: Model<ContextDocument>
	) {
		this.openai = new OpenAI({ apiKey: configService.get("OPENAI_API_KEY") });
		// this.createAssistant();
		this.updateAssistant();
	}

	async createAssistant() {
		const defillama = await this.contextModel
			.findOne({ name: "defillama" })
			.exec();
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
		const blockchainInteraction = () => `
		*Blockchain Interaction:*
		You can execute function calls to access and process blockchain data. Please note these network aliases:
		${Object.entries(chainIdToFullName)
				.map(([id, name]) => `* ${name}: chainId: ${id}`)
				.join("\n")}
		Only select the user's chain coming from the thread if the chain is not mentioned anywhere in the message.
	`;
		const fewShots = `
	### Few-Shot Examples:

	**For Receive QR Code:**
	**Example 1:**
	**User:** "How can I receive tokens?"
	**Assistant:** "Below is your Cluster Receive QR code. Share it with others to receive tokens."

	**Example 2:**
	**User:** "How can I receive tokens?"
	**Assistant:** "receive"

	**Example 3:**
	**User:** "What is the gas price on Ethereum?"
	**Assistant:** "The current gas price on Ethereum is 50 Gwei. <br/> For more details, visit <a href='https://etherscan.io/gastracker'>Etherscan Gas Tracker</a>."

	**Example 4:**
	**User:** "Add a contact named Alice with address 0x1234..."
	**Assistant:** "Contact 'Alice' with address '0x1234...' has been successfully added to your address book."

	**Example 5:**
	**User:** "Show me my token balances on Binance Smart Chain."
	**Assistant:**
	<ul>
		<li>BNB: 10.5</li>
		<li>CAKE: 200</li>
	</ul>

	**Example 6:**
	**User:** "What's the current price of Ethereum?"
	**Assistant:** According to CoinGecko, the current price of Ethereum (ETH) is $1,850.42. <br/>
	<a href="https://www.coingecko.com/en/coins/ethereum">Check real-time Ethereum price on CoinGecko</a>

	**Example 7:**
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

	**Example 8:**
	**User:** "Swap 100 USDC for DAI on Polygon"
	**Assistant:** Confirm the address of USDC and DAI on Polygon network.

	**Example 9:**
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

	**Example 10:**
	**User:** "I want to send 0.5 ETH to Bob. His address is 0xabcde..."
	**Assistant:** "You are about to send 0.5 ETH to 0xabcde... <br/> Please confirm the transaction."

	**Example 11:**
	**User:** "What's the price of Bitcoin today?"
	**Assistant:** "Fetching the latest Bitcoin price... <br/> The current price of Bitcoin is $25,800."

	**Example 12:**
	**User:** "Can you list my NFTs on OpenSea?"
	**Assistant:** "I cannot directly list your NFTs on OpenSea. <br/> However, I can provide you with helpful resources and guides on how to do so."

	**Example 13:**
	**User:** "What is the difference between Ethereum and Polygon?"
	**Assistant:** "Both Ethereum and Polygon are blockchain platforms, but they differ in scalability and cost. <br/> Ethereum is more established but has higher fees, while Polygon offers faster and cheaper transactions."

	**Example 14:**
	**User:** "How do I connect my MetaMask wallet?"
	**Assistant:** "I cannot directly connect to your MetaMask wallet due to security reasons. <br/> To manage your wallet, please refer to the MetaMask support documentation."

	**Example 15:**
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
		const instructions = `
		You are CluBot, a state-of-the-art smart wallet assistant developed by Cluster Protocol to assist users with cryptocurrency and blockchain-related inquiries. Your responses should highlight the independent capabilities of Cluster Protocol's technology without referencing external AI technologies or providers.
		Details of CluBot are as follows:
		${clusterProtocolFeatures}

		**File Search:**
		1. Defillama store ${defillama.vectorId}, you can find the following files:
			1. **Protocols**: Provide a comprehensive list of all protocols, including their total value locked (TVL). Use File ID: ${defillama.currentFiles[0]
			}
			2. **Stablecoins**: Provide a detailed list of all stablecoins, including their circulating amounts and current prices. Use File ID: ${defillama.currentFiles[1]
			}
			3. **DEXs**: Provide a list of all decentralized exchanges (DEXs), along with summaries of their trading volumes and historical data. Use File ID: ${defillama.currentFiles[2]
			}
			4. **Options**: Provide a list of all options DEXs, including summaries of their trading volumes and historical data. Use File ID:${defillama.currentFiles[3]
			}
			5. **Fees and Revenue**: Provide a list of all protocols with summaries of their fees and revenue, along with historical data. Use File ID: ${defillama.currentFiles[4]
			}

			NOTE on FileSearch: we don't have any historical data for protocols, stablecoins and fees and revenue. We only have current data.
			and we don't have yield based data. so we can't provide you with yield based data. if any query related to yield based data and historical data, we will not provide you with any data. just say "no data found".

		${fewShots}

				**Available Custom Function Calls:**
		${customTools
				.map(
					(tool) =>
						`* ${tool.function.name}(${this.getSimplifiedParams(
							tool.function.parameters
						)}): ${tool.function.description}`
				)
				.join("\n")}

			Note: all other queries other than anything but not related to custom function calls use File Search tool call.

			${blockchainInteraction()}
			 Always prioritize providing secure, reliable information and maintain a professional demeanor in all interactions. Reflect the capabilities of Cluster Protocol in every response.
				Use File Search tool call first if needed,Feel free to COMBINE multiple tool calls when appropriate.
				**Data Handling:**
				Never fabricate data; rely on user input and reliable sources. Avoid placeholders; use actual values provided by the user.

				**Classification Instructions:**
			 Check the user query and his context to determine the type of query. if the query is related to crypto then proceed. otherwise, respond with a message that the query is not related to crypto.
		Please use the relevant file IDs to extract and present the required information.
		NOTE: No Need to show tool call details in the response(function names). And THINK ALWAYS YOU ARE RESPONDING TO A USER ORIENTED **CHAT** BOT RESPONSE.
		don't use this words in the response : summery, abstract and so on.
											**Response Instructions:**
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
		`;
		const assistant = await this.openai.beta.assistants.create({
			name: "CluBot",
			model: "gpt-4o",
			description:
				"I'm CluBot, a state-of-the-art smart wallet assistant developed by Cluster Protocol to assist users with cryptocurrency and blockchain-related inquiries. Your responses should highlight the independent capabilities of Cluster Protocol's technology without referencing external AI technologies or providers.",
			instructions,
			// biome-ignore lint/style/useNamingConvention: <explanation>
			tool_resources: {
				// biome-ignore lint/style/useNamingConvention: <explanation>
				file_search: {
					// biome-ignore lint/style/useNamingConvention: <explanation>
					vector_store_ids: [defillama.vectorId],
				},
			},
			tools: [
				// { type: "code_interpreter" },
				// biome-ignore lint/style/useNamingConvention: <explanation>
				{ type: "file_search", file_search: { max_num_results: 10 } },
				...customTools,
			],
		});
		console.log(
			"🚀 ~ AssistantService ~ createAssistant ~ assistant:",
			assistant
		);
	}

	@Cron(CronExpression.EVERY_30_MINUTES)
	async updateAssistant() {
		const defillama = await this.contextModel
			.findOne({ name: "defillama" })
			.exec();

		await this.openai.beta.assistants.update(
			this.configService.get("OPENAI_ASSISTANT_ID"),
			{
				// biome-ignore lint/style/useNamingConvention: <explanation>
				tool_resources: {
					// biome-ignore lint/style/useNamingConvention: <explanation>
					file_search: {
						// biome-ignore lint/style/useNamingConvention: <explanation>
						vector_store_ids: [defillama.vectorId],
					},
				},
			}
		);
	}
	private getSimplifiedParams(parameters: any) {
		return Object.keys(parameters.properties).join(", ");
	}

	async getChatById(chatId: string): Promise<any> {
		const chat = await this.chatService.getChatById(chatId);
		const list = await this.openai.beta.threads.messages.list(chat.threadId);
		const msgs = list.data.map((msg) => {
			const content =
				msg.content[0].type === "text"
					? msg.content[0].text.value
					: msg.content[0].type;
			return {
				role: msg.role,
				content,
				// extra: {
				// 	table: msg.extra?.table,
				// 	web3Data: msg.extra?.web3Data,
				// },
			};
		});

		return {
			messages: msgs.reverse().slice(1),
		};
	}

	async getUserChats(userId: Types.ObjectId): Promise<any> {
		const chats = await this.chatService.getUserChats(userId);
		return chats;
	}

	async deleteChat(userInfo: ReqUser, chatId: string) {
		const chat = await this.chatService.getChatById(chatId);
		if (!chat) {
			throw new Error("Chat not found");
		}
		await this.openai.beta.threads.del(chat.threadId);
		return await this.chatService.deleteChat(userInfo, chatId);
	}
	private async saveMessageToChat(chatId: string, message: any) {
		await this.chatService.addMessageToChat(chatId, message);
		return { ...message, chatId };
	}

	async chat(
		message: string,
		userId: string,
		cId?: string,
		role?: string,
		chainId?: number
	) {
		const user = await this.usersService.findById(userId);
		if (!user) { throw new Error("User not found"); }
		let chat = cId !== "" ? await this.chatService.getChatById(cId) : null;
		if (role === "assistant" && chat) {
			await this.openai.beta.threads.messages.create(chat.threadId, {
				role: "assistant",
				content: message,
			});
			return {
				chatId: chat.id,
				content: message,
				role: "assistant",
			};
		}

		if (!chat) {
			const title = await this.generatedTitle(message);
			const thread = await this.openai.beta.threads.create({
				messages: [
					{
						role: "assistant",
						content: `User address: ${user.address}, Network: ${chainIdToFullName[chainId]}`,
						metadata: {
							content: `User address: ${user.address}, Network: ${chainIdToFullName[chainId]}`,
						},
					},
				],
			});
			chat = await this.chatService.createChat2(
				new Types.ObjectId(userId),
				thread.id,
				title
			);
		}

		console.log("🚀 ~ AssistantService ~ chatId:", chat.id);
		await this.openai.beta.threads.messages.create(chat.threadId, {
			role: "user",
			metadata: {
				address: user.address,
				chainId: chainIdToFullName[chainId],
			},
			content: message,
		});

		const run = await this.openai.beta.threads.runs.create(chat.threadId, {
			// biome-ignore lint/style/useNamingConvention: <explanation>
			assistant_id: this.configService.get("OPENAI_ASSISTANT_ID"),
			// biome-ignore lint/style/useNamingConvention: <explanation>
			additional_instructions: `
			if tool call 'swapTokens' or 'sendTransaction' is called, don't respond like transaction initiated or something like that, just respond with the details needed to swap the tokens, swapping happening on the frontend.
			if tool call file_search is called, don't show the source the data is retrieved from, just respond with the data.
			if tool call 'getReceiveQrCode' is called,just respond with the data no need to change network or anything else.
			`,
		});

		let runStatus = await this.openai.beta.threads.runs.retrieve(
			chat.threadId,
			run.id
		);
		const customToolData = {
			isCalled: false,
			toolName: [],
			web3Status: false,
			web3Data: null,
			table: null,
			content: ''
		};
		while (runStatus.status !== "completed") {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			runStatus = await this.openai.beta.threads.runs.retrieve(
				chat.threadId,
				run.id
			);

			if (runStatus.status === "requires_action") {
				customToolData.isCalled = true;
				const toolCalls =
					runStatus.required_action.submit_tool_outputs.tool_calls;
				const toolOutputs = [];
				for (const tool of toolCalls) {
					console.log(
						"🚀 ~ AssistantService ~ tool.function.name:",
						tool.function.name
					);
					customToolData.toolName.push(tool.function.name);
					const args = JSON.parse(tool.function.arguments);
					console.log("🚀 ~ AssistantService ~ args:", args);
					const data = await this[tool.function.name](args, user);
					console.log("🚀 ~ AssistantService ~ data:", data);
					customToolData.web3Status = data?.web3Status;
					customToolData.web3Data = data?.extra?.web3Data;
					customToolData.table = data?.extra?.table;
					customToolData.content = data?.content;
					toolOutputs.push({
						// biome-ignore lint/style/useNamingConvention: <explanation>
						tool_call_id: tool.id,
						output: JSON.stringify(data),
					});
				}
				await this.openai.beta.threads.runs.submitToolOutputs(
					chat.threadId,
					run.id,
					{
						// biome-ignore lint/style/useNamingConvention: <explanation>
						tool_outputs: toolOutputs,
					}
				);
				continue;
			}

			if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
				console.log(`Run status: ${runStatus.status}`);
				break;
			}
		}
		const messages = await this.openai.beta.threads.messages.list(
			chat.threadId
		);

		// Find the last message for the current run
		const lastMessageForRun = messages.data
			.filter(
				(message) => message.run_id === run.id && message.role === "assistant"
			)
			.pop();

		// If an assistant message is found, console.log() it
		if (lastMessageForRun) {
			const res =
				lastMessageForRun.content[0].type === "text" &&
				lastMessageForRun.content[0].text.value;
			console.log("🚀 ~ AssistantService ~ res:", res);
			if (customToolData.web3Status || customToolData.table) {
				return {
					role: "assistant",
					content: customToolData?.table === 'qr-code' ? customToolData.content : res,
					extra: {
						web3Data: customToolData?.web3Data,
						table: customToolData?.table,
					},
				};
			}
			return {
				role: "assistant",
				content: res,
				// extra: {
				// 	table: res ? res.split("\n") : [],
				// 	web3Data: res ? res.split("\n") : [],
				// },
				chatId: chat.id,
			};
		} if (!["failed", "cancelled", "expired"].includes(runStatus.status)) {
			console.log("No response received from the assistant.");
		}
	}

	private async generatedTitle(message: string): Promise<string> {
		const response = await this.openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					name: "CluBot",
					content:
						"Generate a title for the chat based on user input, in 3 TO 5 words",
				},
				{ role: "user", content: message },
			],
		});

		const title = response.choices[0].message.content;
		if (!title) { throw new Error("Invalid chat title"); }
		return title;
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
				content += ` on chain ${chainIdToFullName[chainNameToId[args.chainName]]
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
					content: `No holders found for the token ${args.tokenAddress
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
				content: `Here are the top holders for the token ${args.tokenAddress
					} on chain ${chainIdToFullName[chainNameToId[args.chainName]]} <br/> `,
				extra: { table: tableData, tableString },
			};
		}
		return {
			content: "Please provide the token and chain to get the top holders",
		};
	}

	// biome-ignore lint/style/useNamingConvention: <explanation>
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
				tableString += `Chain: ${args.chainName} Name: ${item.contract_display_name
					} Amount: ${Number(item.balance)} nftContractAddress: ${item?.contract_address
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
				content += ` on chain ${chainIdToFullName[chainNameToId[args.chainName]]
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
					content: `Here is the gas price for the chain ${chainIdToFullName[chainId]
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

	private async sendTransaction(args: any, user: any) {
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
				Token Address: ${isNativeToken(args.tokenAddress) ? "native" : args.tokenAddress
					} <br/><br/>
				Please confirm the transaction`,
				extra: { web3Data, table: [] },
				web3Status: true,
			};
		}
		return {
			content:
				"Please provide the valid to address, amount and coin to send the transaction",
		};
	}

	private async swapTokens(args: any, user: any) {
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
					content: `No balances found for the user to swap the token in with key ${args.tokenInNameOrAddress
						} on chain ${chainIdToFullName[chainNameToId[args.chainName]]
						} <br/> if you want to swap the token with the token address, please provide the valid token address`,
				};
			}
			if (filteredBalances.length > 1) {
				const tableData = filteredBalances.map((item, index) => {
					if (isNativeToken(item.id)) {
						item.id = chainNameToNativeAddress[args.chainName];
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
					extra: { table: tableData },
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
					content: `No token found for the name ${args.tokenOutNameOrAddress
						} to swap the token out on chain ${chainIdToFullName[chainNameToId[args.chainName]]
						} <br/> if you want to swap the token with the token address, please provide the valid token address`,
				};
			}

			filteredTokens = await this.getBestTokenList(
				args.tokenOutNameOrAddress,
				args.tokenInNameOrAddress,
				filteredTokens
			);

			if (filteredTokens?.length > 1) {
				const tableData = filteredTokens.map((item, index) => {
					if (isNativeToken(item.tokenAddress)) {
						item.tokenAddress = chainNameToNativeAddress[args.chainName];
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
					extra: { table: tableData },
				};
			}
			args.tokenOutAddress = filteredTokens[0].tokenAddress;
		}

		if (args.tokenInAddress && args.amountToSwap && args.tokenOutAddress) {
			const web3Data = {
				chain: chainIdToCoingeckoId[chainNameToId[args.chainName]],
				tokenIn: isNativeToken(args.tokenInAddress)
					? chainNameToNativeAddress[args.chainName]
					: args.tokenInAddress,
				tokenOut: isNativeToken(args.tokenOutAddress)
					? chainNameToNativeAddress[args.chainName]
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
					Token In: ${isNativeToken(args.tokenInAddress)
						? chainNameToNativeAddress[args.chainName]
						: args.tokenInAddress
					} <br/>
					Token Out: ${isNativeToken(args.tokenOutAddress)
						? chainNameToNativeAddress[args.chainName]
						: args.tokenOutAddress
					} <br/>
					Amount: ${args.amountToSwap} <br/><br/>
					Please confirm the transaction`,
				extra: { web3Data, table: [] },
				web3Status: true,
			};
		}

		return {
			content:
				"Please provide the valid token in, token out and amount to swap the token",
		};
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
