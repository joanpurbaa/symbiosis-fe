import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { UserIcon } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { Documents } from "./Documents";
import { SROICalculator } from "./SROICalculator";
import { Profile } from "../../user/userComponent/Profil";
import { DoubleArrowIcon } from "../../../icon/doubleArrowIcon";
import UserSidebar from "../UserSidebar";
import { RightArrowIcon } from "../../../icon/rightArrowIcon";

interface Language {
	code: string;
	name: string;
}

interface User {
	id: string;
	email: string;
	role: "user" | "admin";
	name: string;
	isLoggedIn: boolean;
}

export default function UserDashboard() {
	const location = useLocation().pathname;
	const pathSegments = location.split("/").filter(Boolean);
	const navigate = useNavigate();

	const [responsiveSidebar, setResponsiveSidebar] = useState(false);
	const [showLogoutText, setShowLogoutText] = useState(!responsiveSidebar);
	const [showMinimizeText, setShowMinimizeText] = useState(!responsiveSidebar);
	const [currentLanguage, setCurrentLanguage] = useState<Language>({
		code: "en",
		name: "English",
	});
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	// Check user authentication on component mount
	useEffect(() => {
		const userData = localStorage.getItem("currentUser");
		if (userData) {
			const user: User = JSON.parse(userData);
			setCurrentUser(user);
		} else {
			navigate("/masuk");
		}
	}, [navigate]);

	function handleMobileResponsive() {
		setResponsiveSidebar(!responsiveSidebar);
	}

	useEffect(() => {
		let delay: number;

		if (responsiveSidebar) {
			setShowLogoutText(false);
			setShowMinimizeText(false);
		} else {
			delay = setTimeout(() => {
				setShowLogoutText(true);
				setShowMinimizeText(true);
			}, 100);
		}

		return () => clearTimeout(delay);
	}, [responsiveSidebar]);

	const handleLogout = () => {
		localStorage.removeItem("currentUser");
		navigate("/masuk");
	};

	const renderMainContent = () => {
		const currentSection = pathSegments[1];

		switch (currentSection) {
			case "dashboard":
				return <Dashboard language={currentLanguage} />;
			case "documents":
				return <Documents language={currentLanguage} />;
			case "sroi-calculator":
				return <SROICalculator language={currentLanguage} />;
			case "profile":
				return <Profile language={currentLanguage} />;
			default:
				return <Dashboard language={currentLanguage} />;
		}
	};

	if (!currentUser) {
		return <div>Loading...</div>;
	}

	return (
		<section className="h-screen flex flex-col overflow-hidden">
			<header className="z-20 fixed w-full bg-gray-100 text-white flex justify-between items-center p-[20px] shadow-xs">
				<section>
					<a className="flex items-center space-x-4 cursor-pointer" href="/">
						<img className="w-40" src="/logo-symbiosis.svg" alt="" />
					</a>
				</section>
				<section className="flex justify-end items-center gap-[15px] md:gap-[30px]">
					<select
						value={currentLanguage.code}
						onChange={(e) =>
							setCurrentLanguage({
								code: e.target.value,
								name: e.target.value === "en" ? "English" : "Indonesian",
							})
						}
						className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm">
						<option value="en">English</option>
						<option value="id">Indonesian</option>
					</select>

					<div className="flex items-center gap-3">
						<h3 className="text-zinc-800 text-base lg:text-xl font-medium">
							{currentUser.name}
						</h3>
						<UserIcon className="w-7 h-7 text-zinc-800" />
					</div>
				</section>
			</header>
			<section className="h-full flex bg-[#0B0D12]">
				<aside
					className={`transition-all ease-in-out duration-300 ${
						responsiveSidebar ? "w-[100px]" : "w-[400px]"
					} py-[40px] h-full bg-gray-100 shadow-2xl flex flex-col justify-between p-[20px]`}>
					<div className="flex flex-col justify-between gap-20">
						<div></div>
						<ul className="space-y-[20px]">
							<li
								onClick={handleMobileResponsive}
								className="flex justify-center items-center text-zinc-600 text-sm md:text-base gap-[10px] md:gap-[20px] py-[10px] cursor-pointer">
								{showMinimizeText && "Minimize Sidebar"}
								{!responsiveSidebar ? (
									<DoubleArrowIcon className="w-6 lg:w-7" />
								) : (
									<div className="rotate-180">
										<DoubleArrowIcon className="w-6 lg:w-7" />
									</div>
								)}
							</li>
							<UserSidebar responsiveSidebar={responsiveSidebar} />
						</ul>
					</div>
					<div className="flex justify-center">
						<button
							onClick={handleLogout}
							className={`flex items-center text-base lg:text-xl text-white font-normal ${
								!responsiveSidebar ? "bg-green-800" : "bg-transparent"
							} rounded-full px-[30px] lg:px-[60px] py-[8px] lg:py-[12px] gap-[10px]`}>
							{showLogoutText && "Logout"}
							<div
								className={`flex justify-center items-center border ${
									!responsiveSidebar ? "border-white" : "border-green-800"
								} border-full rounded-full w-[36px] h-[36px]`}>
								{!responsiveSidebar ? (
									<RightArrowIcon className="w-3 lg:w-5" fill="white" />
								) : (
									<RightArrowIcon className="w-3 lg:w-5" fill="#70B748" />
								)}
							</div>
						</button>
					</div>
				</aside>
				<main
					className={`w-full overflow-y-auto bg-gray-200 ${
						responsiveSidebar ? "col-span-11 w-full" : "col-span-10"
					} flex flex-col gap-[20px] px-[20px] pt-28 pb-5`}>
					{renderMainContent()}
				</main>
			</section>
		</section>
	);
}
