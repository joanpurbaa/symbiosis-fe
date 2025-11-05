import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LayoutDashboard, FileText, Calculator, Users } from "lucide-react";

export default function AdminSidebar({
	responsiveSidebar,
}: {
	responsiveSidebar: boolean;
}) {
	const [sectionLabel, setSectionLabel] = useState<boolean>(!responsiveSidebar);
	const location = useLocation();
	const currentSection = location.pathname.split("/")[2];

	useEffect(() => {
		let delay: number;

		if (responsiveSidebar) {
			setSectionLabel(false);
		} else {
			delay = setTimeout(() => {
				setSectionLabel(true);
			}, 100);
		}

		return () => clearTimeout(delay);
	}, [responsiveSidebar]);

	const menuItems = [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: LayoutDashboard,
			path: "/admin/dashboard",
		},
		{
			id: "documents",
			label: "Documents",
			icon: FileText,
			path: "/admin/documents",
		},
		{
			id: "sroi-calculator",
			label: "SROI Calculator",
			icon: Calculator,
			path: "/admin/sroi-calculator",
		},
		{
			id: "user-management",
			label: "User Management",
			icon: Users,
			path: "/admin/user-management",
		},
	];

	return (
		<>
			{menuItems.map((item) => (
				<div key={item.id}>
					<Link className="block" to={item.path}>
						<li
							className={`flex ${responsiveSidebar && "justify-center"} items-center ${
								currentSection === item.id
									? "bg-green-800 text-white"
									: "bg-transparent text-zinc-600 hover:text-green-800"
							} gap-[20px] p-[10px] rounded-[8px] transition-colors`}>
							<item.icon className="w-6 h-6" />
							{sectionLabel && (
								<span className="text-sm lg:text-base whitespace-nowrap transition-opacity duration-200">
									{item.label}
								</span>
							)}
						</li>
					</Link>
				</div>
			))}
		</>
	);
}
