import { useContext, useEffect, useState } from "react";
import { MyStore } from "../../helper/MyStore";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const AddTokenPage = () => {
	const { balances } = useContext(MyStore);
	const [tokenBalance, setTokenBalance] = useState([] as any[]);
	useEffect(() => {
		if (balances) {
			const tokensList =
				balances && balances?.length
					? balances.filter((token: any) => token.amount > 0 && token.price > 0)
					: [];
			setTokenBalance(tokensList);
		}
	}, [balances]);
	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<div className="m-[6px] border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<div className="flex justify-start items-center gap-x-8">
					<Link to="/more">
						<Button variant="outline" className="!min-w-10 w-10 h-10 !p-1">
							<svg
								className="rotate-180"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z"
								/>
							</svg>
						</Button>
					</Link>

					<h4 className="text-header !mt-0">Balance Tokens</h4>
				</div>

				<div className="h-[70vh] table-bg rounded-[20px] overflow-y-auto hideScrollbar mt-[20px]">
					<div className="flex items-center justify-between pt-[30px] pb-[20px] px-[40px] border-b border-border/80">
						<div className="shrink-0 gap-x-[10px] flex-center">
							Token List{" "}
							<span
								className="w-[35px] cursor-pointer flex-center h-[21px] rounded-[5px]"
								style={{
									background:
										"linear-gradient(106deg, #5bb8da 4%, #9773d2 74%)",
								}}
							>
								{tokenBalance.length < 10
									? `0${tokenBalance.length}`
									: tokenBalance.length}
							</span>
						</div>
						<span>Value</span>
					</div>
					{/* <span
            className="block w-[calc(100%-80px)] mx-auto h-[1px]"
            style={{
              background:
                "linear-gradient(to right, #22171e 0%, #493844 49%, #21171e 100%)",
            }}
          ></span> */}
					<ul>
						{tokenBalance.length ? (
							tokenBalance.map((token, index) => (
								<li
									key={index}
									className="px-[40px] flex items-center justify-between h-[75px] hover:shade"
								>
									<div className="flex-center">
										<span className="text-[#a7a7a7] text-base font-medium mr-8">
											{index + 1}
										</span>
										<div className="flex w-12 h-12 bg-[#fff] rounded-full p-2 shadow-sm flex-center">
											<img
												src={token.logo_url}
												alt="Ethereum"
												className="w-10 rounded-full"
											/>
										</div>
										<div className="flex flex-col items-start gap-y-[4px] ml-[30px]">
											<span className="text-sm font-medium text-[#a7a7a7]">
												{token.name}
											</span>
											<span className="text-sm font-medium text-[#656565]">
												{token.symbol}
											</span>
										</div>
									</div>
									<span className="text-base font-semibold text-white">
										{token.amount} {token.symbol} ≈ $
										{(token.amount * token.price).toFixed(2)}
									</span>
								</li>
							))
						) : (
							<p className="text-[#a7a7a7] text-base py-10 text-center">
								No Tokens Found
							</p>
						)}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default AddTokenPage;
