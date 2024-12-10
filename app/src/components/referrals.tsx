import { useContext, useEffect, useState } from "react";
import { CopySVG } from "../atoms/svg-comps/copy";
import UserSVG from "../atoms/svg-comps/user-icon";
import { MyStore } from "../helper/MyStore";
import { copyToClipboard } from "../lib/utils";
import { RWebShare } from "react-web-share";
import { ShareSVG } from "../atoms/svg-comps/share";
import { fetchData } from "../helper/fetchData";
import { BASE_URL } from "../lib/config";

const ReferralsPage = () => {
	const { referralId } = useContext(MyStore);
	const [referrals, setReferrals] = useState([]);
	useEffect(() => {
		fetchData(`${BASE_URL}/user/referrals`, "GET")
			.then((data) => {
				setReferrals(data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<div className="md:m-[6px] md:border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[8px] md:px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<h4 className="text-header mt-0">Referrals</h4>
				<div className="h-auto lg:h-[240px] cluster-card-1 rounded-[20px] mt-[20px] flex flex-col-reverse lg:flex-row items-center justify-around gap-x-[30px] px-[10px] lg:px-[40px] py-[10px]">
					<div className="flex flex-col items-start gap-y-[30px]">
						<div className="grid w-full lg:block">
							<div className="text-sm hidden">Share your referral code</div>
							<h4 className="text-[22px] font-bold inline-block mt-2 lg:mr-[8px]">
								Share and enjoy the benefits
							</h4>
							for every friend you refer.
						</div>
						<div className="flex flex-col lg:flex-row w-full items-end gap-x-[30px]">
							<div className="border-box-container w-full lg:w-[333px] uppercase h-[54px] rounded-[10px] bg-[#0b0a0d] flex items-center justify-around">
								{referralId}{" "}
								<CopySVG
									className="text-[#493844] cursor-pointer active:scale-90"
									onClick={() => copyToClipboard(referralId)}
								/>
							</div>
							<div className="mx-auto my-[20px] lg:my-0">
								<div className="text-sm w-max text-white mb-2">
									Share Your Referral Link
								</div>
								<div className="text-black">
									<RWebShare
										data={{
											text: `Cluster! 😉 👉  `,
											url: `${window.location.origin}/login?referralCode=${referralId}`,
											title: "Share your referral link with friends!",
										}}
										key={"share_page_1"}
									>
										<button className="flex-center cursor-pointer w-full h-[35px] text-white flex-grow-0 px-4 py-2 rounded-[12px] bg-gradient-to-r from-[#5bb8da] via-[#5bb8da] to-[#9773d2]">
											<ShareSVG className="w-[15px] text-white mr-[7px]" />
											<span className="text-sm text-white">Share Code</span>
										</button>
									</RWebShare>
								</div>
								{/* <div className="mt-[15px] flex gap-x-[15px]">
                  <img
                    src="/social-icons/google.png"
                    alt="google"
                    className="w-[35px] cursor-pointer"
                  />
                  <img
                    src="/social-icons/twitter.png"
                    alt="google"
                    className="w-[35px] cursor-pointer"
                  />
                  <img
                    src="/social-icons/facebook.png"
                    alt="google"
                    className="w-[35px] cursor-pointer"
                  />
                  <img
                    src="/social-icons/linkedin.png"
                    alt="google"
                    className="w-[35px] cursor-pointer"
                  />
                </div> */}
							</div>
						</div>
					</div>
					<div>
						<img
							src="/referral-illustration.png"
							alt="referral illustration"
							className="w-[251px] object-contain"
						/>
					</div>
				</div>

				<div className="h-[70vh] table-bg rounded-[20px] overflow-y-auto hideScrollbar mt-[20px]">
					<div className="flex items-center justify-between pt-[30px] pb-[20px] px-[40px] border-b border-border/80">
						<div className="shrink-0 gap-x-[10px] flex-center">
							User Address{" "}
							<span
								className="w-[35px] cursor-pointer flex-center h-[21px] rounded-[5px]"
								style={{
									background:
										"linear-gradient(106deg, #5bb8da 4%, #9773d2 74%)",
								}}
							>
								{referrals.length}
							</span>
						</div>
						{/* <span>Earned</span> */}
					</div>
					<ul>
						{referrals && referrals.length > 0 ? (
							referrals.map((user: any, index) => (
								<li
									key={index}
									className="px-[40px] flex items-center justify-between h-[75px] hover:shade"
								>
									<div className="flex-center">
										<UserSVG className="text-[#a48181] w-[20px]" />
										<div className="flex flex-col items-start gap-y-[4px] ml-[30px]">
											<div className="flex justify-center items-center gap-x-2 text-[#a7a7a7] text-sm font-medium">
												{user?.address}
												<CopySVG
													className="text-[#493844] cursor-pointer active:scale-90 "
													onClick={() => copyToClipboard(user?.address)}
												/>
											</div>
										</div>
									</div>
									{/* <span className="text-base font-semibold text-white">
									$78,584.78
								</span> */}
								</li>
							))
						) : (
							<p className="text-[#a7a7a7] text-base py-6 text-center">
								No Referrals Found
							</p>
						)}
					</ul>
				</div>
				{/* <button className="mx-auto block mt-[16px]">See All</button> */}
			</div>
		</section>
	);
};

export default ReferralsPage;
