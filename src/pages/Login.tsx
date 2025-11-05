import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FormErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
	username?: string;
	general?: string;
}

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const API_BASE_URL = "http://localhost:8000/api";

	useEffect(() => {
		const currentUser = localStorage.getItem("currentUser");
		const accessToken = localStorage.getItem("access_token");

		if (currentUser && accessToken) {
			navigate("/admin/dashboard", { replace: true });
		}
	}, [navigate]);

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
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateSignUp = (): boolean => {
		const newErrors: FormErrors = {};

		if (!name) {
			newErrors.general = "Name is required";
		}

		if (!email) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!username) {
			newErrors.username = "Username is required";
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
		setErrors({});

		if (!validateLogin()) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("access_token", data.access_token);
				localStorage.setItem("currentUser", JSON.stringify(data.user));

				setSuccessMessage("Login successful!");

				setTimeout(() => {
					navigate("/admin/dashboard", { replace: true });
				}, 500);
			} else {
				setErrors({
					general: data.message || "Invalid email or password",
				});
			}
		} catch (error) {
			console.error("Login error:", error);
			setErrors({
				general: "Network error. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setSuccessMessage("");
		setErrors({});

		if (!validateSignUp()) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					name: name,
					email,
					username,
					password,
					password_confirmation: confirmPassword,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("access_token", data.access_token);
				localStorage.setItem("currentUser", JSON.stringify(data.user));

				setSuccessMessage("Account created successfully!");

				setTimeout(() => {
					navigate("/admin/dashboard", { replace: true });
				}, 500);
			} else {
				if (data.errors) {
					const apiErrors: FormErrors = {};
					Object.keys(data.errors).forEach((key) => {
						if (key === "email") apiErrors.email = data.errors[key][0];
						if (key === "username") apiErrors.username = data.errors[key][0];
						if (key === "password") apiErrors.password = data.errors[key][0];
					});
					setErrors(apiErrors);
				} else {
					setErrors({
						general: data.message || "Registration failed",
					});
				}
			}
		} catch (error) {
			console.error("Registration error:", error);
			setErrors({
				general: "Network error. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
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
				</div>

				<div className="bg-white rounded-lg shadow-xl p-6">
					{successMessage && (
						<div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg mb-4">
							<CheckCircle className="w-4 h-4" />
							<span className="text-sm">{successMessage}</span>
						</div>
					)}

					{errors.general && (
						<div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg mb-4">
							<AlertCircle className="w-4 h-4" />
							<span className="text-sm">{errors.general}</span>
						</div>
					)}

					<div className="w-full">
						<div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1 mb-6">
							<button
								type="button"
								onClick={() => {
									setActiveTab("login");
									setErrors({});
								}}
								className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
									activeTab === "login"
										? "bg-white text-gray-900 shadow"
										: "text-gray-600 hover:text-gray-900"
								}`}>
								Login
							</button>
							<button
								type="button"
								onClick={() => {
									setActiveTab("signup");
									setErrors({});
								}}
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
										Full Name
									</label>
									<input
										type="text"
										placeholder="John Doe"
										value={name}
										onChange={(e) => {
											setName(e.target.value);
											if (errors.general) setErrors({ ...errors, general: undefined });
										}}
										className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-900 mb-2 block">
										Username
									</label>
									<input
										type="text"
										placeholder="Choose a username"
										value={username}
										onChange={(e) => {
											setUsername(e.target.value);
											if (errors.username) setErrors({ ...errors, username: undefined });
										}}
										className={`w-full px-3 py-2 bg-white border ${
											errors.username ? "border-red-500" : "border-gray-300"
										} rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
									/>
									<ErrorMessage message={errors.username} />
								</div>
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
