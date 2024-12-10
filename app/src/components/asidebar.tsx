import { Link, useLocation } from "react-router-dom";
import { BrowseActivitySVG } from "../atoms/svg-comps/browse-activity";
import { DashboardSVG } from "../atoms/svg-comps/dashboard";
import { MoreRoundedSVG } from "../atoms/svg-comps/more-rounded";
import { PersonAddSVG } from "../atoms/svg-comps/person-add";
import { Robot2SVG } from "../atoms/svg-comps/robot-2";
import { SendSVG } from "../atoms/svg-comps/send-rounded";
import { SwapVerticalSVG } from "../atoms/svg-comps/swap-vertical";
import clsx from "clsx";

const Asidebar = () => {
	return (
		<div className="asidebar shrink-0 relative bg-black h-[calc(100vh-124px)] min-w-[110px] w-[130px] p-[18px] rounded-b-[8px] border border-t-0 border-[#232323] hidden md:flex items-start justify-center overflow-x-hidden overflow-y-auto hideScrollbar">
			<ul>
				<li>
					<Item text="Dashboard" link="/">
						<DashboardSVG className="black dark:white w-[22px] h-[22px]" />
					</Item>
				</li>
				<li>
					<Item text="CluBot" link="/bot">
						<Robot2SVG className="black dark:white w-[22px] h-[22px]" />
					</Item>
				</li>
				<li>
					<Item text="Activity" link="/activity">
						<BrowseActivitySVG className="black dark:white w-[22px] h-[22px]" />
					</Item>
				</li>
				<li>
					<Item text="Send" link="/send">
						<SendSVG className="black dark:white w-[22px] h-[22px] rotate-[315deg]" />
					</Item>
				</li>
				<li>
					<Item text="Receive" link="/receive">
						<SendSVG className="black dark:white w-[22px] h-[22px] rotate-[140deg]" />
					</Item>
				</li>
				<li>
					<Item text="Swap" link="/swap">
						<SwapVerticalSVG className="black dark:white w-[22px] h-[22px] rotate-[140deg]" />
					</Item>
				</li>
				<li>
					<Item text="Referrals" link="/referrals">
						<PersonAddSVG className="black dark:white w-[22px] h-[22px] rotate-[140deg]" />
					</Item>
				</li>
				<li>
					<Item text="More" link="/more">
						<MoreRoundedSVG className="black dark:white w-[22px] h-[22px]" />
					</Item>
				</li>
			</ul>
		</div>
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
	return (
		<Link to={link || ""}>
			<div
				className={clsx(
					(link === location.pathname ||
						(link !== "/" && location.pathname.includes(link ?? ""))) &&
						"sidebarNavBtn",
					"flex-center flex-col gap-y-[9px] h-[70px]"
				)}
			>
				{children}
				<span className="black dark:white text-[10px] font-seph  uppercase">
					{text}
				</span>
			</div>
		</Link>
	);
};

export default Asidebar;
