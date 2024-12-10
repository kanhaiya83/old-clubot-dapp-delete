import { Link, useLocation } from "react-router-dom";
import { DashboardSVG } from "./svg-comps/dashboard";
import { SwapSVG } from "./svg-comps/swap";
import { Robot2SVG } from "./svg-comps/robot-2";
import { BrowseActivitySVG } from "./svg-comps/browse-activity";
import { MoreRoundedSVG } from "./svg-comps/more-rounded";
import clsx from "clsx";
import { useContext } from "react";
import { MyStore } from "../helper/MyStore";

const BottomNavbar = () => {
	const { chatInboxActive } = useContext(MyStore);
	const location = useLocation();

	if (window.innerWidth > 1024 || chatInboxActive) {
		return;
	}

	return (
		<>
			<div className="block md:hidden h-[71px]"></div>
			<div className="fixed w-full left-0 right-0 bottom-0  bg-black grid grid-cols-5 justify-evenly items-center md:hidden border border-[#232323] rounded-t-[5px]">
				<Item text="Dashboard" link="/">
					<DashboardSVG
						className={clsx(
							location.pathname === "/" && "!opacity-100",
							"w-[20px] h-[20px] opacity-50"
						)}
					/>
				</Item>
				<Item text="Transfer" link="/send">
					<SwapSVG
						className={clsx(
							location.pathname === "/send" && "!opacity-100",
							"opacity-50 w-[20px] h-[20px]"
						)}
					/>
				</Item>
				<Link to={"/bot"}>
					<div
						className={clsx(
							location.pathname === "/bot" && "!opacity-100",
							"flex-center w-[50px] h-[50px] rounded-full opacity-50 m-auto"
						)}
						style={{
							background: "linear-gradient(to bottom, #5bb8da, #635094)",
						}}
					>
						<Robot2SVG
							className={clsx(
								location.pathname === "/bot" && "!opacity-100",
								"opacity-50"
							)}
						/>
					</div>
				</Link>
				<Item text="Activity" link="/activity">
					<BrowseActivitySVG
						className={clsx(
							location.pathname === "/activity" && "!opacity-100 text-white",
							"w-[20px] h-[20px] opacity-50"
						)}
					/>
				</Item>
				<Item text="More" link="/more">
					<MoreRoundedSVG
						className={clsx(
							location.pathname === "/more" && "!opacity-100 text-white",
							"w-[20px] h-[20px] opacity-50"
						)}
					/>
				</Item>
			</div>
		</>
	);
};

const Item = ({
	text,
	children,
	link,
}: {
	text: string;
	children: React.ReactNode;
	link?: string;
}) => {
	const location = useLocation();

	const active = link === location.pathname;
	return (
		<Link to={link || ""}>
			<div
				className={clsx(
					active && "text-white",
					"flex-center flex-col gap-y-[9px] h-[70px]"
				)}
			>
				{children}
				<span
					className={clsx(
						active && "opacity-100 font-medium",
						"black dark:white text-[8px] font-seph uppercase text-[#a7a7a7] opacity-50"
					)}
				>
					{text}
				</span>
			</div>
		</Link>
	);
};

export default BottomNavbar;
