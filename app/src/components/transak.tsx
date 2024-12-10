import { TransakConfig, Transak } from "@transak/transak-sdk";
// import { toast } from "sonner";

const TransakComponent = ({
	name,
	caption,
	icon,
}: {
	name: string;
	caption: string;
	icon: React.ReactNode;
}) => {
	const API = "783d288a-7b25-4cac-9396-21c3b4f126b4";
	// const API = import.meta.env.VITE_TRANSACK_API;
	const openTransak = async () => {
		const transakConfig: TransakConfig = {
			apiKey: API,
			environment: Transak.ENVIRONMENTS.PRODUCTION,
			networks: [
				"ethereum",
				"arbitrum",
				"polygon",
				"optimism",
				"bsc",
				"base",
				"avalanche",
			],
		};

		const transak = new Transak(transakConfig);

		// Initialize the Transak SDK
		// const res =
		await transak.init();

		// if (res === undefined) {
		// 	toast("Oops! Something went wrong. Please try again later.");
		// 	transak.close();
		// 	return;
		// }

		// To get all the events
		Transak.on("*", (data) => {
			console.log("To get all events", data);
		});

		// This will trigger when the user closed the widget
		Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE_REQUEST, () => {
			console.log("Transak SDK close request!");
			transak.close();
		});

		// This will trigger when the user closed the widget
		Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
			console.log("Transak SDK closed!");
			transak.close();
		});

		// This will trigger when the user has confirmed the order
		Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
			console.log(orderData);
		});

		// This will trigger when the order is marked as successful
		Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
			console.log(orderData);
			transak.close();
		});

		// Cleanup on component unmount
		return () => {
			transak.close();
		};
	};

	return (
		<div>
			<div
				onClick={openTransak}
				className="cluster-card h-[100px] w-[25%] gap-x-3 min-w-[300px] max-w-[600px] rounded-[10px] flex items-center justify-start bg-background"
			>
				{icon}

				<div className="flex flex-col gap-y-[3px]">
					<span className="text-base font-semibold text-white">{name}</span>
					<span className="text-sm text-[#534949]">{caption}</span>
				</div>
			</div>
		</div>
	);
};

export default TransakComponent;
