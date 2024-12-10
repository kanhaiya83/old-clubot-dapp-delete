import { CopySVG } from "../atoms/svg-comps/copy";
import Discord from "../atoms/svg-comps/discord";
import DollarSVG from "../atoms/svg-comps/dollar";
import EditSVG from "../atoms/svg-comps/edit";
import EmailSVG from "../atoms/svg-comps/email";
import ManageNetworks from "../atoms/svg-comps/manage-networks";
import MuteSVG from "../atoms/svg-comps/mute";
import People from "../atoms/svg-comps/people";
import { SecuritySVG } from "../atoms/svg-comps/security";
import Telegram from "../atoms/svg-comps/telegram";
import Viber from "../atoms/svg-comps/viber";
import { copyToClipboard } from "../lib/utils";

const ProfilePage = () => {
	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<div className="m-[6px] border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<h4 className="text-[16px] font-medium ml-[20px]">My Profile</h4>
				<div className="h-[300px] bg-[#53297c3b] rounded-[20px] mt-[20px] flex items-center">
					<div className="grow flex justify-center">
						<div className="flex flex-col items-center">
							<div className="w-[160px] h-[160px] bg-[#d9d9d9] rounded-full overflow-hidden">
								<img
									src="./dummy-profile.png"
									alt="profile"
									className="w-full h-full"
								/>
							</div>
							<button className="w-[123px] h-[40px] text-[#a7a7a7] rounded-[5px] border-[2px] border-[#493844] flex-center mt-[18px]">
								Log Out
							</button>
						</div>
						<div className="ml-[15px]">
							<div className="flex gap-x-[10px] items-center">
								<h4>John Smith</h4>
								<EditSVG className="text-[#493844]" />
							</div>
							<div className="flex gap-x-[10px] mt-[28px]">
								<Icon>{<EmailSVG className="text-[#a48181]" />}</Icon>
								<span className="text-[#656565] text-sm">Email Id:</span>{" "}
								<span>johnsmith@gmail.com</span>
								<EditSVG className="text-[#493844]" />
							</div>
							<div className="flex gap-x-[10px] mt-[18px]">
								<Icon>{<People className="text-[#a48181]" />}</Icon>
								<span className="text-[#656565] text-sm">Refer Id:</span>{" "}
								<span>johnsmith@gmail.com</span>
								<EditSVG className="text-[#493844]" />
							</div>
							<div className="flex gap-x-[10px] mt-[18px]">
								<Icon>{<SecuritySVG className="text-[#a48181]" />}</Icon>
								<span className="text-[#656565] text-sm">
									Security PIN:
								</span>{" "}
								<span>******</span>
								<EditSVG className="text-[#493844]" />
							</div>
						</div>
					</div>
					<div
						className="w-[1px] h-[167px] my-[16px]"
						style={{
							background:
								"linear-gradient(to bottom, #22171e 0%, #493844 49%, #21171e 100%)",
						}}
					></div>
					<div className="grow">
						<div className="flex flex-col gap-y-[16px]">
							<div className="flex-center  gap-x-[8px]">
								<img src="./Ethereum.png" alt="Etherium" width={36} />
								<span className="text-[#a7a7a7] text-sm truncate max-w-[170px]">
									Ox884750323cb12bc7f2de...
								</span>
								<CopySVG
									className="text-[#493844] cursor-pointer"
									onClick={() => copyToClipboard("Ox884750323cb12bc7f2de")}
								/>
							</div>
							<div className="flex-center  gap-x-[8px]">
								<img src="./Bitcoin.png" alt="Etherium" width={36} />
								<span className="text-[#a7a7a7] text-sm truncate max-w-[170px]">
									Ox884750323cb12bc7f2de...
								</span>
								<CopySVG
									className="text-[#493844] cursor-pointer active:scale-90"
									onClick={() => copyToClipboard("Ox884750323cb12bc7f2de")}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-x-[30px] mt-[30px]">
					<div
						className="w-[377px] h-[309px] rounded-[20px] px-[40px] py-[28px]"
						style={{
							background: "linear-gradient(34deg, #191116 -22%, #2a1d26 224%)",
						}}
					>
						<h4 className="text-base font-semibold">Networks</h4>
						<div className="flex justify-between mt-[30px]">
							<span className="text-[#656565]">Primary </span>
							<div className="text-[#a7a7a7] flex gap-x-[8px]">
								<img src="/Ethereum.png" alt="Ethereum" width={28} />
								Ethereum
							</div>
						</div>
						<div className="flex justify-between mt-[18px]">
							<span className="text-[#656565]">Available</span>
							<div className="text-[#a7a7a7] flex gap-x-[8px]">76,4,321</div>
						</div>
						<button
							className="h-[50px] w-full bg-transparent rounded-[5px] flex-center mt-[82px]"
							style={{
								background: "linear-gradient(106deg, #5bb8da 4%, #9773d2 74%)",
							}}
						>
							<ManageNetworks className="text-white" />
							<span className="text-base font-medium ml-[10px]">
								Manage Networks
							</span>
						</button>
					</div>

					<div
						className="w-[377px] h-[309px] rounded-[20px] px-[40px] py-[28px]"
						style={{
							background: "linear-gradient(34deg, #191116 -22%, #2a1d26 224%)",
						}}
					>
						<h4 className="text-base font-semibold">Settings</h4>
						<div className="flex justify-between mt-[30px]">
							<span className="text-[#656565]">Language:</span>
							<div className="text-[#a7a7a7] flex items-center gap-x-[8px]">
								<img src="/flag.png" alt="Ethereum" width={28} />
								US English
							</div>
						</div>
						<div className="flex justify-between mt-[30px]">
							<span className="text-[#656565]">Currency:</span>
							<div className="text-[#a7a7a7] flex items-center gap-x-[8px]">
								<div className="w-[22px] h-[22px] rounded-full bg-[#36252f] flex-center">
									<DollarSVG className="text-[#a48181]" />
								</div>
								US English
							</div>
						</div>
						<div className="flex justify-between mt-[30px]">
							<span className="text-[#656565]">Sounds:</span>
							<div className="text-[#a7a7a7] flex items-center gap-x-[8px]">
								<div className="w-[22px] h-[22px] rounded-full bg-[#36252f] flex-center">
									<MuteSVG className="text-[#a48181]" />
								</div>
								Mute
							</div>
						</div>
						<div className="flex justify-between mt-[30px]">
							<span className="text-[#656565]">Theme:</span>
							<div className="text-[#a7a7a7] flex items-center gap-x-[8px]">
								<label className="inline-flex items-center cursor-pointer">
									<input type="checkbox" value="" className="sr-only peer" />
									<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#a48181] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#36252f]"></div>
								</label>
							</div>
						</div>
					</div>

					<div
						className="w-[377px] h-[309px] rounded-[20px] px-[40px] py-[28px]"
						style={{
							background: "linear-gradient(34deg, #191116 -22%, #2a1d26 224%)",
						}}
					>
						<h4 className="text-base font-semibold">Connected Platforms</h4>
						<div className="flex justify-between mt-[30px]">
							<span className="text-[#656565]">Telegram</span>
							<Telegram className="text-[#a48181]" />
						</div>
						<div className="flex justify-between mt-[20px]">
							<span className="text-[#656565]">Viber</span>
							<Viber className="text-[#a48181]" />
						</div>
						<div className="flex justify-between mt-[20px]">
							<span className="text-[#656565]">Discord</span>
							<Discord className="text-[#a48181]" />
						</div>
						<button className="w-full border border-white rounded-[5px] h-[49px] mt-[30px]">
							Connect More
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

const Icon = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex-center bg-[#36252f] rounded-full w-[22px] h-[22px]">
			{children}
		</div>
	);
};

export default ProfilePage;
