import MoreAction from "../../atoms/more-action";
import AddToken from "../../atoms/svg-comps/add-token";
// import DollarSVG from "../../atoms/svg-comps/dollar";
import People from "../../atoms/svg-comps/people";
import { PersonAddSVG } from "../../atoms/svg-comps/person-add";
// import Tether from "../../atoms/svg-comps/tether";
import { Networks } from "../networks";
// import TransakComponent from "../transak";

const MorePage = () => {
	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<div className="md:m-[6px] md:border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[8px] md:px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<h4 className="text-header mt-0 text-center md:text-left">
					More Actions
				</h4>

				<h4 className="text-header text-base font-bold mt-[20px] md:my-10 flex justify-start gap-x-4 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M18.21 9.21C15.93 10.78 13.45 13.3 13 17h2v2H9v-2h2c-.5-4.5-4.37-8-9-8V7c4.39 0 8.22 2.55 10 6.3c1.13-2.43 2.99-4.25 4.78-5.52L14 5h7v7z"
						/>
					</svg>
					Top Apps
				</h4>
				<div className="flex justify-center lg:justify-start gap-x-[25px] gap-y-[30px] mt-[30px] flex-wrap">
					<MoreAction
						name="Balance Tokens"
						caption="List of your tokens"
						icon={<AddToken className="w-[30px] mr-[18px]" />}
						link="/more/balance-tokens"
					/>
					<MoreAction
						name="Contacts"
						caption="List of your contacts"
						icon={<People className="w-[30px] h-[25px] mr-[18px] text-white" />}
						link="/more/contacts"
					/>
					{/* <MoreAction
						name="Buy Tokens"
						caption="Coming soon!!"
						icon={<Tether className="w-[30px] h-[25px] mr-[18px] text-white" />}
						link="/more/convert"
					/> */}
					{/* <TransakComponent
						name="Buy Tokens"
						caption="Buy tokens with fiat"
						icon={<Tether className="w-[30px] h-[25px] mr-[18px] text-white" />}
					/>
					<TransakComponent
						name="Sell Tokens"
						caption="Sell tokens for fiat"
						icon={
							<DollarSVG className="w-[30px] h-[25px] mr-[18px] text-white" />
						}
					/> */}
				</div>
				<h4 className="text-header text-base font-bold mb-10 mt-16 flex justify-start gap-x-4 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12"
						/>
					</svg>
					Settings
				</h4>
				<div className="flex justify-center lg:justify-start gap-x-[25px] gap-y-[30px] mt-[30px] flex-wrap">
					<Networks />
					<MoreAction
						name="Referrals"
						caption="Share your referral code"
						icon={
							<PersonAddSVG className="black dark:white w-[30px] h-[30px] rotate-[140deg]" />
						}
						link="/referrals"
						disabled={false}
					/>
				</div>
			</div>
		</section>
	);
};

export default MorePage;
