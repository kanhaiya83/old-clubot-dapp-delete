import { useContext, useEffect, useState } from "react";
import QuestionMarkSVG from "../atoms/svg-comps/question-mark";
import { MyStore } from "../helper/MyStore";
import { useAccount } from "wagmi";
import { TOKENS_BY_CHAIN } from "../utils/tokens";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog"

const SelectTokens = ({ headline, type }: { headline: string, type: 'send' | 'receive' }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { loggedUser, sendToken, receiveToken, balances, selectedChain, setReceiveToken, setSendToken } = useContext(MyStore);
  const {chain} = useAccount()
  const [tokensList, setTokensList] = useState(TOKENS_BY_CHAIN[chain?.id as keyof typeof TOKENS_BY_CHAIN] as any[]);

  useEffect(() => {
    if (chain?.id) {
      // Add Native currency and filter and show those tokens which have balance first and then the rest later
      const nativeCurrency = chain?.nativeCurrency?.symbol
      const bal = balances.filter((balance) => balance?.symbol === nativeCurrency)

      // Show the tokens with balance  after the native currency
      const tokensWithoutBalance = TOKENS_BY_CHAIN[chain?.id as keyof typeof TOKENS_BY_CHAIN].filter((token) => !balances.find((balance) => balance?.symbol.toLowerCase() === token?.symbol.toLowerCase()))
      const tokensWithBalance = balances.filter((balance) => (balance?.price > 0) && (balance?.amount >0) && (balance?.symbol !== nativeCurrency))
      // Sort based on balance
      tokensWithBalance.sort((a, b) => {
        const aBalance = balances.find((balance) => balance.symbol.toLowerCase() === a.symbol.toLowerCase())
        const bBalance = balances.find((balance) => balance.symbol.toLowerCase() === b.symbol.toLowerCase())
        const aCalculatedBalance = (aBalance?.amount * aBalance?.price)
        const bCalculatedBalance = (bBalance?.amount * bBalance?.price)
        return bCalculatedBalance - aCalculatedBalance
      })

      const list = [...bal, ...tokensWithBalance, ...tokensWithoutBalance]
      setTokensList(list);
    }
  }, [loggedUser, chain, balances]);

  return (
    <div className="relative group w-full">
      <Dialog onOpenChange={(val) => {
        setShowDialog(val)
      }} open={showDialog}>
      <DialogTrigger asChild>
        <button onClick={() => setShowDialog(true)} className="w-full h-[60px] text-base text-[#acacac] font-semibold bg-black border border-border flex items-center justify-start pl-[20px] rounded-[8px] cursor-pointer select-none ">
          {
            ((type==='send') ? sendToken :  receiveToken) ? <>
              <img
                src={((type==='send') ? sendToken :  receiveToken)?.logoURI ? ((type==='send') ? sendToken :  receiveToken)?.logoURI : (((type==='send') ? sendToken :  receiveToken)?.logo_url ? ((type==='send') ? sendToken :  receiveToken)?.logo_url : selectedChain?.logo_url)}
                alt=""
                className="w-[30px] mr-1 bg-white p-[2px] rounded-[10px] h-[30px] object-contain"
              />
              <div className="flex items-start">
                <span className="text-[#a7a7a7] font-medium text-base ml-2">
                  {((type==='send') ? sendToken :  receiveToken).name}
                </span>
                <span className="text-[#656565] text-base ml-1">({((type==='send') ? sendToken :  receiveToken).symbol})</span>
              </div>
            </> :
            <><QuestionMarkSVG className="mr-[10px]" /> {headline}</>
          }
        </button>
      </DialogTrigger>
      <DialogContent className="!block h-[500px]">
        <DialogHeader>
          <span className="text-sm font-semibold text-white text-center inline-block my-[10px]">
            {headline}
          </span>
          <div className="px-[16px]">
            <input
              onChange={(e) => {
                if(e.target.value === '')
                  setTokensList(TOKENS_BY_CHAIN[chain?.id as keyof typeof TOKENS_BY_CHAIN])
                  else
                setTokensList(tokensList?.filter((token) => (token.name.toLowerCase().includes(e.target.value.toLowerCase()) || token.symbol.toLowerCase().includes(e.target.value.toLowerCase()))))

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
          </div></DialogHeader>
      <div className="pt-[8px] w-full relative z-30 block select-none">
        <div
          className="w-full max-h-[350px] pb-[10px] rounded-[8px] text-center overflow-y-auto"
        >
          <ul className="flex justify-start flex-col gap-y-[12px] px-[10px]">
            {
              tokensList?.map((token, index) => (
                <li key={index} onClick={() =>  {
                  if(type === 'send')
                    setSendToken(token)
                  else
                    setReceiveToken(token)
                  setShowDialog(false)
                }}
                className="flex justify-between items-center hover:bg-[#130D11] px-[6px] py-[4px] rounded-[5px] cursor-pointer">
                <div className="flex gap-x-[5px]">
                  <img
                    src={token?.logoURI ? token?.logoURI : (token?.logo_url ? token?.logo_url : selectedChain?.logo_url)}
                    alt=""
                    className="w-[30px] mr-1 bg-white p-[2px] rounded-[10px] h-[30px] object-contain"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[#a7a7a7] font-medium text-xs">
                      {token.name}
                    </span>
                    <span className="text-[#656565] text-xs">{token.symbol}</span>
                  </div>
                </div>
                <span className="text-white text-xs font-semibold">
                  {(token?.amount) ? `${Number(token?.amount).toFixed(6)} ${(token?.symbol)}` : '~'}
                </span>
              </li>
              ))
            }
          </ul>
        </div>
      </div>
      </DialogContent>
    </Dialog>


    </div>
  );
};

export default SelectTokens;
