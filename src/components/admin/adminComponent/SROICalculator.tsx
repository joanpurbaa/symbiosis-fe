import { useState } from "react";
import { TrendingUp, AlertCircle } from "lucide-react";

interface Language {
	code: string;
	name: string;
}

interface SROIInputs {
	initialInvestment: number;
	annualBenefits: number;
	annualCosts: number;
	timeframe: number;
	discountRate: number;
}

interface SROIResult {
	sroi: number;
	netBenefit: number;
	benefitCostRatio: number;
	paybackPeriod: number;
	presentValue: number;
}

interface SROICalculatorProps {
	language: Language;
}

export function SROICalculator({ language }: SROICalculatorProps) {
	const [inputs, setInputs] = useState<SROIInputs>({
		initialInvestment: 50000,
		annualBenefits: 30000,
		annualCosts: 5000,
		timeframe: 5,
		discountRate: 10,
	});

	const [result, setResult] = useState<SROIResult | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const calculateSROI = () => {
		const newErrors: Record<string, string> = {};

		if (inputs.initialInvestment <= 0)
			newErrors.initialInvestment = "Must be greater than 0";
		if (inputs.annualBenefits <= 0)
			newErrors.annualBenefits = "Must be greater than 0";
		if (inputs.annualCosts < 0) newErrors.annualCosts = "Cannot be negative";
		if (inputs.timeframe <= 0) newErrors.timeframe = "Must be greater than 0";
		if (inputs.discountRate < 0) newErrors.discountRate = "Cannot be negative";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setErrors({});

		let presentValueBenefits = 0;
		let presentValueCosts = 0;

		for (let year = 1; year <= inputs.timeframe; year++) {
			const discountFactor = Math.pow(1 + inputs.discountRate / 100, -year);
			presentValueBenefits += inputs.annualBenefits * discountFactor;
			presentValueCosts += inputs.annualCosts * discountFactor;
		}

		const totalCosts = inputs.initialInvestment + presentValueCosts;
		const netBenefit = presentValueBenefits - totalCosts;
		const sroi = (netBenefit / inputs.initialInvestment) * 100;
		const benefitCostRatio = presentValueBenefits / totalCosts;
		const annualNetBenefit = inputs.annualBenefits - inputs.annualCosts;
		const paybackPeriod =
			annualNetBenefit > 0 ? inputs.initialInvestment / annualNetBenefit : 0;

		setResult({
			sroi,
			netBenefit,
			benefitCostRatio,
			paybackPeriod: Math.max(0, paybackPeriod),
			presentValue: presentValueBenefits,
		});
	};

	const handleInputChange = (field: keyof SROIInputs, value: number) => {
		setInputs((prev) => ({ ...prev, [field]: value }));
		setResult(null);
	};

	return (
		<div className="bg-white p-6 space-y-6 rounded-md">
			<div>
				<h1 className="text-3xl font-bold text-foreground mb-2">
					{language.code === "en" ? "SROI Calculator" : "Kalkulator SROI"}
				</h1>
				<p className="text-muted-foreground">
					{language.code === "en"
						? "Calculate Social Return on Investment with discount rate analysis"
						: "Hitung Pengembalian Investasi Sosial dengan analisis tingkat diskon"}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-1 border-0 shadow-md rounded-lg p-6">
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								{language.code === "en"
									? "Initial Investment ($)"
									: "Investasi Awal ($)"}
							</label>
							<input
								type="number"
								value={inputs.initialInvestment}
								onChange={(e) =>
									handleInputChange(
										"initialInvestment",
										Number.parseFloat(e.target.value) || 0
									)
								}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									errors.initialInvestment ? "border-red-500" : "border-border"
								}`}
							/>
							{errors.initialInvestment && (
								<p className="text-xs text-red-500 mt-1">{errors.initialInvestment}</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								{language.code === "en" ? "Annual Benefits ($)" : "Manfaat Tahunan ($)"}
							</label>
							<input
								type="number"
								value={inputs.annualBenefits}
								onChange={(e) =>
									handleInputChange(
										"annualBenefits",
										Number.parseFloat(e.target.value) || 0
									)
								}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									errors.annualBenefits ? "border-red-500" : "border-border"
								}`}
							/>
							{errors.annualBenefits && (
								<p className="text-xs text-red-500 mt-1">{errors.annualBenefits}</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								{language.code === "en" ? "Annual Costs ($)" : "Biaya Tahunan ($)"}
							</label>
							<input
								type="number"
								value={inputs.annualCosts}
								onChange={(e) =>
									handleInputChange(
										"annualCosts",
										Number.parseFloat(e.target.value) || 0
									)
								}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									errors.annualCosts ? "border-red-500" : "border-border"
								}`}
							/>
							{errors.annualCosts && (
								<p className="text-xs text-red-500 mt-1">{errors.annualCosts}</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								{language.code === "en" ? "Timeframe (Years)" : "Jangka Waktu (Tahun)"}
							</label>
							<input
								type="number"
								value={inputs.timeframe}
								onChange={(e) =>
									handleInputChange("timeframe", Number.parseFloat(e.target.value) || 1)
								}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									errors.timeframe ? "border-red-500" : "border-border"
								}`}
							/>
							{errors.timeframe && (
								<p className="text-xs text-red-500 mt-1">{errors.timeframe}</p>
							)}
						</div>

						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								{language.code === "en" ? "Discount Rate (%)" : "Tingkat Diskon (%)"}
							</label>
							<input
								type="number"
								value={inputs.discountRate}
								onChange={(e) =>
									handleInputChange(
										"discountRate",
										Number.parseFloat(e.target.value) || 0
									)
								}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									errors.discountRate ? "border-red-500" : "border-border"
								}`}
							/>
							{errors.discountRate && (
								<p className="text-xs text-red-500 mt-1">{errors.discountRate}</p>
							)}
							<p className="text-xs text-muted-foreground mt-1">
								{language.code === "en"
									? "Typical range: 5-15%"
									: "Kisaran tipikal: 5-15%"}
							</p>
						</div>

						<button
							onClick={calculateSROI}
							className="w-full bg-green-800 hover:bg-green-900 text-primary-foreground font-semibold py-2 rounded-lg">
							{language.code === "en" ? "Calculate SROI" : "Hitung SROI"}
						</button>
					</div>
				</div>

				<div className="lg:col-span-2 space-y-6">
					{result && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="border-0 shadow-md rounded-lg p-6">
									<div className="pb-3">
										<div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
											<TrendingUp size={16} />
											{language.code === "en" ? "SROI Ratio" : "Rasio SROI"}
										</div>
									</div>
									<div>
										<p className="text-4xl font-bold text-primary">
											{result.sroi.toFixed(1)}%
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											{language.code === "en"
												? "Return on investment"
												: "Pengembalian investasi"}
										</p>
									</div>
								</div>

								<div className="border-0 shadow-md rounded-lg p-6">
									<div className="pb-3">
										<div className="text-sm font-medium text-muted-foreground">
											{language.code === "en" ? "Net Benefit" : "Manfaat Bersih"}
										</div>
									</div>
									<div>
										<p className="text-4xl font-bold text-accent">
											${result.netBenefit.toLocaleString()}
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											{language.code === "en"
												? "Total net benefit (PV)"
												: "Total manfaat bersih (PV)"}
										</p>
									</div>
								</div>

								<div className="border-0 shadow-md rounded-lg p-6">
									<div className="pb-3">
										<div className="text-sm font-medium text-muted-foreground">
											{language.code === "en"
												? "Benefit-Cost Ratio"
												: "Rasio Manfaat-Biaya"}
										</div>
									</div>
									<div>
										<p className="text-4xl font-bold text-primary">
											{result.benefitCostRatio.toFixed(2)}:1
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											{language.code === "en"
												? "Benefits per dollar spent"
												: "Manfaat per dolar yang dikeluarkan"}
										</p>
									</div>
								</div>

								<div className="border-0 shadow-md rounded-lg p-6">
									<div className="pb-3">
										<div className="text-sm font-medium text-muted-foreground">
											{language.code === "en" ? "Payback Period" : "Periode Pengembalian"}
										</div>
									</div>
									<div>
										<p className="text-4xl font-bold text-accent">
											{result.paybackPeriod.toFixed(1)}
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											{language.code === "en"
												? "Years to break even"
												: "Tahun untuk mencapai titik impas"}
										</p>
									</div>
								</div>
							</div>

							<div className="border-0 shadow-md bg-primary/5 rounded-lg p-4 flex items-start gap-3">
								<AlertCircle className="text-primary mt-0.5" size={18} />
								<div>
									<p className="text-sm font-medium text-foreground">
										{language.code === "en" ? "SROI Interpretation" : "Interpretasi SROI"}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{result.sroi > 0
											? language.code === "en"
												? `For every $1 invested, you get $${(
														1 +
														result.sroi / 100
												  ).toFixed(2)} in return.`
												: `Untuk setiap $1 yang diinvestasikan, Anda mendapatkan $${(
														1 +
														result.sroi / 100
												  ).toFixed(2)} sebagai pengembalian.`
											: language.code === "en"
											? "The investment does not generate positive returns."
											: "Investasi tidak menghasilkan pengembalian positif."}
									</p>
								</div>
							</div>

							<div className="border-0 shadow-md rounded-lg p-6">
								<div>
									<div className="text-lg font-semibold">
										{language.code === "en" ? "Annual Projection" : "Proyeksi Tahunan"}
									</div>
									<div className="text-sm text-muted-foreground">
										{language.code === "en"
											? "Benefits vs Costs over time (discounted)"
											: "Manfaat vs Biaya seiring waktu (didiskon)"}
									</div>
								</div>
								<div className="mt-4 h-64 flex items-center justify-center border rounded">
									{language.code === "en"
										? "Chart Component - Benefits vs Costs"
										: "Komponen Grafik - Manfaat vs Biaya"}
								</div>
							</div>

							<div className="border-0 shadow-md rounded-lg p-6">
								<div>
									<div className="text-lg font-semibold">
										{language.code === "en"
											? "Cumulative Net Benefit Trend"
											: "Tren Manfaat Bersih Kumulatif"}
									</div>
									<div className="text-sm text-muted-foreground">
										{language.code === "en"
											? "Total net benefit over time"
											: "Total manfaat bersih seiring waktu"}
									</div>
								</div>
								<div className="mt-4 h-52 flex items-center justify-center border rounded">
									{language.code === "en"
										? "Chart Component - Net Benefit Trend"
										: "Komponen Grafik - Tren Manfaat Bersih"}
								</div>
							</div>
						</>
					)}

					{!result && (
						<div className="border-0 shadow-md rounded-lg p-12">
							<div className="text-center">
								<p className="text-muted-foreground mb-4">
									{language.code === "en"
										? 'Enter your investment details and click "Calculate SROI" to see results'
										: 'Masukkan detail investasi Anda dan klik "Hitung SROI" untuk melihat hasil'}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
