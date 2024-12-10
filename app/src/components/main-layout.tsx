import { Header } from "./header";
import Asidebar from "./asidebar";
import GradientLine from "../atoms/gradient-line";
import { Outlet, useLocation } from "react-router-dom";
import BottomNavbar from "../atoms/bottom-navbar";

const MainLayout = () => {
	const location = useLocation();
	return (
		<main className="w-full h-[100svh] px-[6px] md:px-[16px] py-[9px] relative">
			<Header />
			<div className="flex justify-start items-start">
				{location.pathname === "/login" ||
				location.pathname === "/cluster-receive" ? (
					<></>
				) : (
					<Asidebar />
				)}

				<GradientLine className="ml-[-1px] hidden md:block" />
				<Outlet />
			</div>
			{location.pathname === "/login" ||
			location.pathname === "/cluster-receive" ? (
				<></>
			) : (
				<BottomNavbar />
			)}
		</main>
	);
};

export default MainLayout;
