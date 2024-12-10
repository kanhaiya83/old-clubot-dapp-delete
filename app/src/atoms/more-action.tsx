import { Link } from "react-router-dom";

const MoreAction = ({
	icon,
	name,
	caption,
	link,
	disabled,
}: {
	icon: React.ReactNode;
	name: string;
	caption: string;
	link: string;
	disabled?: boolean;
}) => {
	return (
		<Link to={link} className={`${disabled ? "pointer-events-none" : ""}`}>
			<div className="cluster-card h-[100px] w-[25%] gap-x-3 min-w-[300px] max-w-[600px] rounded-[10px] flex items-center justify-start bg-background">
				{icon}
				<div className="flex flex-col gap-y-[3px]">
					<span className="text-base font-semibold text-white">{name}</span>
					<span className="text-sm text-[#534949]">{caption}</span>
				</div>
			</div>
		</Link>
	);
};

export default MoreAction;
