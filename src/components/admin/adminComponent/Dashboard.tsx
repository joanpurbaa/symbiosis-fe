import { FileText, BarChart3, TrendingUp } from "lucide-react";
import { ChatAssistant } from "../../ChatAssistant";

interface Language {
	code: string;
	name: string;
}

const documentTypeData = [
	{ name: "PDF", value: 45 },
	{ name: "Word", value: 25 },
	{ name: "Excel", value: 20 },
	{ name: "Other", value: 10 },
];

const COLORS = ["#6b9f7f", "#8fb89f", "#a8c9a8", "#c1dcc1"];

interface DashboardProps {
	language: Language;
}

export function Dashboard({ language }: DashboardProps) {
	return (
		<main className="p-6 md:p-8 space-y-8 bg-white rounded-md">
			<section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
						Dashboard
					</h1>
					<p className="text-sm md:text-base text-muted-foreground mt-1">
						Welcome back
					</p>
				</div>
			</section>

			<section>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-card to-card/95">
						<div className="pb-2 px-4 pt-4">
							<div className="text-sm text-muted-foreground flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-md">
									<FileText className="text-green-800" size={18} />
								</div>
								Total Documents
							</div>
						</div>
						<div className="px-4 pb-4">
							<div className="text-3xl md:text-4xl font-bold text-foreground">148</div>
							<div className="text-sm md:text-base text-muted-foreground mt-2">
								+12 this month
							</div>
						</div>
					</div>

					<div className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-card to-card/95">
						<div className="pb-2 px-4 pt-4">
							<div className="text-sm text-muted-foreground flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-md">
									<BarChart3 className="text-green-800" size={18} />
								</div>
								Active Uploads
							</div>
						</div>
						<div className="px-4 pb-4">
							<div className="text-3xl md:text-4xl font-bold text-foreground">24</div>
							<div className="text-sm md:text-base text-muted-foreground mt-2">
								In progress
							</div>
						</div>
					</div>

					<div className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-card to-card/95">
						<div className="pb-2 px-4 pt-4">
							<div className="text-sm text-muted-foreground flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-md">
									<TrendingUp className="text-green-800" size={18} />
								</div>
								Storage Used
							</div>
						</div>
						<div className="px-4 pb-4">
							<div className="text-3xl md:text-4xl font-bold text-foreground">
								2.4 GB
							</div>
							<div className="text-sm md:text-base text-muted-foreground mt-2">
								of 10 GB
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full">
				<div className="w-full h-[64vh] md:h-[56vh] sm:h-[48vh] min-h-[420px]">
					<ChatAssistant language={language} />
				</div>
			</section>

			<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 h-[420px]">
					<div className="h-full border-0 shadow-lg rounded-xl bg-gradient-to-br from-card to-card/95 overflow-hidden">
						<div className="px-6 pt-6">
							<div className="text-base md:text-lg">Documents Uploaded</div>
							<div className="text-sm text-muted-foreground">
								Monthly document uploads and processing trends
							</div>
						</div>
						<div className="p-4 h-[calc(100%-72px)]">
							<div className="w-full h-full flex items-center justify-center">
								Bar Chart Component
							</div>
						</div>
					</div>
				</div>

				<div className="lg:col-span-1 h-[420px]">
					<div className="h-full border-0 shadow-lg rounded-xl bg-gradient-to-br from-card to-card/95 overflow-hidden">
						<div className="px-6 pt-6">
							<div className="text-base md:text-lg">Document Type Distribution</div>
							<div className="text-sm text-muted-foreground">
								Breakdown of document types in your library
							</div>
						</div>
						<div className="p-6 h-[calc(100%-72px)]">
							<div className="flex h-full items-center">
								<div style={{ width: "100%", height: 220 }}>
									<div className="w-full h-full flex items-center justify-center">
										Pie Chart Component
									</div>
								</div>
								<div className="ml-4 flex-1">
									{documentTypeData.map((item, idx) => (
										<div
											key={idx}
											className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors mb-2">
											<div
												className="w-4 h-4 rounded"
												style={{ backgroundColor: COLORS[idx % COLORS.length] }}
											/>
											<span className="text-sm font-medium text-foreground">
												{item.name}
											</span>
											<span className="text-sm text-muted-foreground ml-auto font-semibold">
												{item.value}%
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
