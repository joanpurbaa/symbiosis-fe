import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface LoginPageProps {
	onLogin: (userData: unknown) => void;
}

interface FormErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export default function Login({ onLogin }: LoginPageProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const mockUsers = [
		{
			id: "1",
			email: "user@example.com",
			password: "password123",
			role: "user" as const,
			name: "Regular User",
		},
		{
			id: "2",
			email: "admin@example.com",
			password: "admin123",
			role: "admin" as const,
			name: "Administrator",
		},
	];

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string): boolean => {
		return password.length >= 8;
	};

	const validateLogin = (): boolean => {
		const newErrors: FormErrors = {};

		if (!email) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (!validatePassword(password)) {
			newErrors.password = "Password must be at least 8 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateSignUp = (): boolean => {
		const newErrors: FormErrors = {};

		if (!email) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!password) {
			newErrors.password = "Password is required";
		} else if (!validatePassword(password)) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setSuccessMessage("");

		if (!validateLogin()) {
			return;
		}

		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const user = mockUsers.find(
			(u) => u.email === email && u.password === password
		);

		if (user) {
			const userData = {
				id: user.id,
				email: user.email,
				role: user.role,
				name: user.name,
				isLoggedIn: true,
			};

			localStorage.setItem("currentUser", JSON.stringify(userData));

			setSuccessMessage("Login successful!");
			setTimeout(() => onLogin(userData), 500);
		} else {
			setErrors({
				email: "Invalid email or password",
				password: "Invalid email or password",
			});
		}

		setIsLoading(false);
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setSuccessMessage("");

		if (!validateSignUp()) {
			return;
		}

		setIsLoading(true);

		const existingUser = mockUsers.find((u) => u.email === email);
		if (existingUser) {
			setErrors({ email: "User with this email already exists" });
			setIsLoading(false);
			return;
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newUser = {
			id: Date.now().toString(),
			email,
			password,
			role: "user" as const,
			name: email.split("@")[0],
		};

		const userData = {
			id: newUser.id,
			email: newUser.email,
			role: newUser.role,
			name: newUser.name,
			isLoggedIn: true,
		};

		localStorage.setItem("currentUser", JSON.stringify(userData));

		setIsLoading(false);
		setSuccessMessage("Account created successfully!");
		setTimeout(() => onLogin(userData), 500);
	};

	const ErrorMessage = ({ message }: { message?: string }) => {
		if (!message) return null;
		return (
			<div className="flex items-center gap-2 text-red-600 text-sm mt-1">
				<AlertCircle className="w-4 h-4" />
				<span>{message}</span>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="flex justify-center mb-6">
						<img
							src="/logo-symbiosis.svg"
							alt="Symbiosis logo"
							className="w-32 md:w-40 lg:w-48 h-auto object-contain"
						/>
					</div>

					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Symbiosis Dashboard
					</h1>
					<p className="text-gray-600 mb-4">Manage your documents and analytics</p>

					{/* Demo credentials info */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mb-4">
						<p className="font-semibold">Demo Credentials:</p>
						<p>User: user@example.com / password123</p>
						<p>Admin: admin@example.com / admin123</p>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-xl p-6">
					{successMessage && (
						<div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg mb-4">
							<CheckCircle className="w-4 h-4" />
							<span className="text-sm">{successMessage}</span>
						</div>
					)}

					<div className="w-full">
						<div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1 mb-6">
							<button
								type="button"
								onClick={() => setActiveTab("login")}
								className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
									activeTab === "login"
										? "bg-white text-gray-900 shadow"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								Login
							</button>
							<button
								type="button"
								onClick={() => setActiveTab("signup")}
								className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
									activeTab === "signup"
										? "bg-white text-gray-900 shadow"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								Sign Up
							</button>
						</div>

						{activeTab === "login" && (
							<form onSubmit={handleLogin} className="space-y-4">
								<div>
									<label className="text-sm font-medium text-gray-900 mb-2 block">
										Email
									</label>
									<input
										type="email"
										placeholder="your@email.com"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (errors.email) setErrors({ ...errors, email: undefined });
										}}
										className={`w-full px-3 py-2 bg-white border ${
											errors.email ? "border-red-500" : "border-gray-300"
										} rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
									/>
									<ErrorMessage message={errors.email} />
								</div>
								<div>
									<label className="text-sm font-medium text-gray-900 mb-2 block">
										Password
									</label>
									<input
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											if (errors.password) setErrors({ ...errors, password: undefined });
										}}
										className={`w-full px-3 py-2 bg-white border ${
											errors.password ? "border-red-500" : "border-gray-300"
										} rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
									/>
									<ErrorMessage message={errors.password} />
								</div>
								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors">
									{isLoading ? "Logging in..." : "Login"}
								</button>
							</form>
						)}

						{activeTab === "signup" && (
							<form onSubmit={handleSignUp} className="space-y-4">
								<div>
									<label className="text-sm font-medium text-gray-900 mb-2 block">
										Email
									</label>
									<input
										type="email"
										placeholder="your@email.com"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (errors.email) setErrors({ ...errors, email: undefined });
										}}
										className={`w-full px-3 py-2 bg-white border ${
											errors.email ? "border-red-500" : "border-gray-300"
										} rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
									/>
									<ErrorMessage message={errors.email} />
								</div>
								<div>
									<label className="text-sm font-medium text-gray-900 mb-2 block">
										Password
									</label>
									<input
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											if (errors.password) setErrors({ ...errors, password: undefined });
										}}
										className={`w-full px-3 py-2 bg-white border ${
											errors.password ? "border-red-500" : "border-gray-300"
										} rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
									/>
									<ErrorMessage message={errors.password} />
									<p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-900 mb-2 block">
										Confirm Password
									</label>
									<input
										type="password"
										placeholder="••••••••"
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
											if (errors.confirmPassword)
												setErrors({ ...errors, confirmPassword: undefined });
										}}
										className={`w-full px-3 py-2 bg-white border ${
											errors.confirmPassword ? "border-red-500" : "border-gray-300"
										} rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
									/>
									<ErrorMessage message={errors.confirmPassword} />
								</div>
								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors">
									{isLoading ? "Creating Account..." : "Create Account"}
								</button>
							</form>
						)}
					</div>
				</div>

				<p className="text-center text-sm text-gray-600 mt-6">
					© 2025 Symbiosis Dashboard. All rights reserved.
				</p>
			</div>
		</div>
	);
}
