/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const MyStore = createContext({
	loggedUser: {} as any,
	setLoggedUser: (_value: any) => {},
	chatList: [] as any,
	setChatList: (_value: any) => {},
	selectedChat: "",
	setSelectedChat: (_value: string) => {},
	sendToken: null as any,
	setSendToken: (_value: any) => {},
	receiveToken: null as any,
	setReceiveToken: (_value: any) => {},
	referralId: "",
	setReferralId: (_value: string) => {},
	listedChains: [] as any,
	setListedChains: (_value: any) => {},
	selectedChain: {} as any,
	setSelectedChain: (_value: string) => {},
	balances: [] as any[],
	setBalances: (_value: any) => {},
	chatInboxActive: true,
	setChatInboxActive: (_: boolean) => {},
	referralCode: "",
	setReferralCode: (_value: string) => {},
	isSendOtc: false as boolean,
	setIsSendOtc: (_value: boolean) => {},
	otcValue: "" as string,
	setOtcValue: (_value: string) => {},
	chatHistory: [] as any[],
	setChatHistory: (_value: any) => {},
	isChatLoading: false,
	setIsChatLoading: (_value: boolean) => {},
});