import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface Language {
	code: string;
	name: string;
}

interface ProfileData {
	name: string;
	position: string | null;
	email: string;
	username: string;
	company_address: string | null;
	work_field: string | null;
}

interface PasswordData {
	current_password: string;
	new_password: string;
	new_password_confirmation: string;
}

interface ProfileProps {
	language: Language;
}

export function Profile({ language }: ProfileProps) {
	const [profileData, setProfileData] = useState<ProfileData>({
		name: "",
		position: null,
		email: "",
		username: "",
		company_address: null,
		work_field: null,
	});

	const [passwordData, setPasswordData] = useState<PasswordData>({
		current_password: "",
		new_password: "",
		new_password_confirmation: "",
	});

	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [isLoadingProfile, setIsLoadingProfile] = useState(false);
	const [isLoadingPassword, setIsLoadingPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
		{}
	);

	const API_BASE_URL = "http://localhost:8000/api";

	// Load user data from localStorage
	useEffect(() => {
		const currentUser = localStorage.getItem("currentUser");
		if (currentUser) {
			const user = JSON.parse(currentUser);
			setProfileData({
				name: user.name || "",
				position: user.position || null,
				email: user.email || "",
				username: user.username || "",
				company_address: user.company_address || null,
				work_field: user.work_field || null,
			});
		}
	}, []);

	const handleInputChange = (field: keyof ProfileData, value: string) => {
		setProfileData((prev) => ({
			...prev,
			[field]: value || null,
		}));
	};

	const handlePasswordChange = (field: keyof PasswordData, value: string) => {
		setPasswordData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Clear error for this field
		if (passwordErrors[field]) {
			setPasswordErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSaveProfile = async () => {
		setIsLoadingProfile(true);
		setErrorMessage("");
		setSuccessMessage("");

		try {
			const token = localStorage.getItem("access_token");

			const response = await fetch(`${API_BASE_URL}/user/profile`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: profileData.name,
					position: profileData.position,
					company_address: profileData.company_address,
					work_field: profileData.work_field,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				// Update localStorage dengan data terbaru
				const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
				const updatedUser = { ...currentUser, ...data.user };
				localStorage.setItem("currentUser", JSON.stringify(updatedUser));

				setSuccessMessage(
					language.code === "en"
						? "Profile updated successfully"
						: "Profil berhasil diperbarui"
				);
				setIsEditingProfile(false);

				// Clear success message after 3 seconds
				setTimeout(() => setSuccessMessage(""), 3000);
			} else {
				setErrorMessage(
					data.message ||
						(language.code === "en"
							? "Failed to update profile"
							: "Gagal memperbarui profil")
				);
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			setErrorMessage(
				language.code === "en"
					? "Network error. Please try again."
					: "Kesalahan jaringan. Silakan coba lagi."
			);
		} finally {
			setIsLoadingProfile(false);
		}
	};

	const handleChangePassword = async () => {
		// Validate password
		const newErrors: Record<string, string> = {};

		if (!passwordData.current_password) {
			newErrors.current_password =
				language.code === "en"
					? "Current password is required"
					: "Password saat ini wajib diisi";
		}

		if (!passwordData.new_password) {
			newErrors.new_password =
				language.code === "en"
					? "New password is required"
					: "Password baru wajib diisi";
		} else if (passwordData.new_password.length < 8) {
			newErrors.new_password =
				language.code === "en"
					? "Password must be at least 8 characters"
					: "Password minimal 8 karakter";
		}

		if (!passwordData.new_password_confirmation) {
			newErrors.new_password_confirmation =
				language.code === "en"
					? "Password confirmation is required"
					: "Konfirmasi password wajib diisi";
		} else if (
			passwordData.new_password !== passwordData.new_password_confirmation
		) {
			newErrors.new_password_confirmation =
				language.code === "en" ? "Passwords do not match" : "Password tidak cocok";
		}

		if (Object.keys(newErrors).length > 0) {
			setPasswordErrors(newErrors);
			return;
		}

		setIsLoadingPassword(true);
		setErrorMessage("");
		setSuccessMessage("");
		setPasswordErrors({});

		try {
			const token = localStorage.getItem("access_token");

			const response = await fetch(`${API_BASE_URL}/user/password`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					current_password: passwordData.current_password,
					new_password: passwordData.new_password,
					new_password_confirmation: passwordData.new_password_confirmation,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setSuccessMessage(
					language.code === "en"
						? "Password changed successfully"
						: "Password berhasil diubah"
				);
				setPasswordData({
					current_password: "",
					new_password: "",
					new_password_confirmation: "",
				});
				setIsChangingPassword(false);

				// Clear success message after 3 seconds
				setTimeout(() => setSuccessMessage(""), 3000);
			} else {
				if (data.errors) {
					setPasswordErrors(data.errors);
				} else {
					setErrorMessage(
						data.message ||
							(language.code === "en"
								? "Failed to change password"
								: "Gagal mengubah password")
					);
				}
			}
		} catch (error) {
			console.error("Error changing password:", error);
			setErrorMessage(
				language.code === "en"
					? "Network error. Please try again."
					: "Kesalahan jaringan. Silakan coba lagi."
			);
		} finally {
			setIsLoadingPassword(false);
		}
	};

	const handleCancelProfileEdit = () => {
		// Reset to original data
		const currentUser = localStorage.getItem("currentUser");
		if (currentUser) {
			const user = JSON.parse(currentUser);
			setProfileData({
				name: user.name || "",
				position: user.position || null,
				email: user.email || "",
				username: user.username || "",
				company_address: user.company_address || null,
				work_field: user.work_field || null,
			});
		}
		setIsEditingProfile(false);
		setErrorMessage("");
	};

	const handleCancelPasswordChange = () => {
		setPasswordData({
			current_password: "",
			new_password: "",
			new_password_confirmation: "",
		});
		setPasswordErrors({});
		setErrorMessage("");
		setIsChangingPassword(false);
	};

	return (
		<div className="p-8 space-y-8 bg-gradient-to-br from-background via-background to-secondary/5 rounded-lg">
			<header className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold mb-2">
						{language.code === "en" ? "Profile" : "Profil"}
					</h1>
					<p className="text-muted-foreground text-lg">
						{language.code === "en"
							? "Manage your profile information"
							: "Kelola informasi profil Anda"}
					</p>
				</div>
				{!isEditingProfile && (
					<button
						onClick={() => setIsEditingProfile(true)}
						className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors">
						{language.code === "en" ? "Edit Profile" : "Edit Profil"}
					</button>
				)}
			</header>

			{/* Success/Error Messages */}
			{(successMessage || errorMessage) && (
				<div
					className={`p-4 rounded-lg border ${
						successMessage
							? "bg-green-50 border-green-200 text-green-800"
							: "bg-red-50 border-red-200 text-red-800"
					}`}>
					<div className="flex items-center gap-2">
						{successMessage ? (
							<CheckCircle className="w-5 h-5" />
						) : (
							<AlertCircle className="w-5 h-5" />
						)}
						<span className="text-sm font-medium">
							{successMessage || errorMessage}
						</span>
					</div>
				</div>
			)}

			{/* Profile Information Section */}
			<section className="bg-background border border-border rounded-lg p-6">
				<h2 className="text-xl font-semibold mb-6">
					{language.code === "en" ? "Profile Information" : "Informasi Profil"}
				</h2>

				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							{language.code === "en" ? "Name" : "Nama"}
						</label>
						<input
							type="text"
							value={profileData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							disabled={!isEditingProfile}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background ${
								!isEditingProfile ? "opacity-70 cursor-not-allowed" : ""
							}`}
							placeholder={language.code === "en" ? "Your name" : "Nama Anda"}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							{language.code === "en" ? "Position" : "Jabatan"}
						</label>
						<input
							type="text"
							value={profileData.position || ""}
							onChange={(e) => handleInputChange("position", e.target.value)}
							disabled={!isEditingProfile}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background ${
								!isEditingProfile ? "opacity-70 cursor-not-allowed" : ""
							}`}
							placeholder={language.code === "en" ? "Your position" : "Jabatan Anda"}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							Email
						</label>
						<input
							type="email"
							value={profileData.email}
							disabled={true}
							className="w-full px-3 py-2 border border-border rounded-lg bg-background opacity-70 cursor-not-allowed"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							Username
						</label>
						<input
							type="text"
							value={profileData.username}
							disabled={true}
							className="w-full px-3 py-2 border border-border rounded-lg bg-background opacity-70 cursor-not-allowed"
							placeholder={language.code === "en" ? "Your username" : "Username Anda"}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							{language.code === "en" ? "Company Address" : "Alamat Perusahaan"}
						</label>
						<textarea
							value={profileData.company_address || ""}
							onChange={(e) => handleInputChange("company_address", e.target.value)}
							disabled={!isEditingProfile}
							rows={3}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background resize-none ${
								!isEditingProfile ? "opacity-70 cursor-not-allowed" : ""
							}`}
							placeholder={
								language.code === "en"
									? "Your company address"
									: "Alamat perusahaan Anda"
							}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							{language.code === "en" ? "Work Field" : "Bidang Pekerjaan"}
						</label>
						<input
							type="text"
							value={profileData.work_field || ""}
							onChange={(e) => handleInputChange("work_field", e.target.value)}
							disabled={!isEditingProfile}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background ${
								!isEditingProfile ? "opacity-70 cursor-not-allowed" : ""
							}`}
							placeholder={
								language.code === "en" ? "Your work field" : "Bidang pekerjaan Anda"
							}
						/>
					</div>
				</div>

				{isEditingProfile && (
					<div className="flex gap-3 pt-6 border-t border-border">
						<button
							onClick={handleSaveProfile}
							disabled={isLoadingProfile}
							className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
							{isLoadingProfile ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									{language.code === "en" ? "Saving..." : "Menyimpan..."}
								</>
							) : language.code === "en" ? (
								"Save Changes"
							) : (
								"Simpan Perubahan"
							)}
						</button>

						<button
							onClick={handleCancelProfileEdit}
							disabled={isLoadingProfile}
							className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
							{language.code === "en" ? "Cancel" : "Batal"}
						</button>
					</div>
				)}
			</section>

			{/* Change Password Section */}
			<section className="bg-background border border-border rounded-lg p-6">
				<h2 className="text-xl font-semibold mb-6">
					{language.code === "en" ? "Change Password" : "Ubah Password"}
				</h2>

				{!isChangingPassword ? (
					<button
						onClick={() => setIsChangingPassword(true)}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						{language.code === "en" ? "Change Password" : "Ubah Password"}
					</button>
				) : (
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								{language.code === "en" ? "Current Password" : "Password Saat Ini"}
							</label>
							<input
								type="password"
								value={passwordData.current_password}
								onChange={(e) =>
									handlePasswordChange("current_password", e.target.value)
								}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									passwordErrors.current_password ? "border-red-500" : "border-border"
								}`}
								placeholder={
									language.code === "en"
										? "Enter current password"
										: "Masukkan password saat ini"
								}
							/>
							{passwordErrors.current_password && (
								<p className="text-red-500 text-sm mt-1">
									{passwordErrors.current_password}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								{language.code === "en" ? "New Password" : "Password Baru"}
							</label>
							<input
								type="password"
								value={passwordData.new_password}
								onChange={(e) => handlePasswordChange("new_password", e.target.value)}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									passwordErrors.new_password ? "border-red-500" : "border-border"
								}`}
								placeholder={
									language.code === "en"
										? "Enter new password"
										: "Masukkan password baru"
								}
							/>
							{passwordErrors.new_password && (
								<p className="text-red-500 text-sm mt-1">
									{passwordErrors.new_password}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								{language.code === "en"
									? "Confirm New Password"
									: "Konfirmasi Password Baru"}
							</label>
							<input
								type="password"
								value={passwordData.new_password_confirmation}
								onChange={(e) =>
									handlePasswordChange("new_password_confirmation", e.target.value)
								}
								className={`w-full px-3 py-2 border rounded-lg bg-background ${
									passwordErrors.new_password_confirmation
										? "border-red-500"
										: "border-border"
								}`}
								placeholder={
									language.code === "en"
										? "Confirm new password"
										: "Konfirmasi password baru"
								}
							/>
							{passwordErrors.new_password_confirmation && (
								<p className="text-red-500 text-sm mt-1">
									{passwordErrors.new_password_confirmation}
								</p>
							)}
						</div>

						<div className="flex gap-3 pt-4">
							<button
								onClick={handleChangePassword}
								disabled={isLoadingPassword}
								className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
								{isLoadingPassword ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										{language.code === "en" ? "Changing..." : "Mengubah..."}
									</>
								) : language.code === "en" ? (
									"Change Password"
								) : (
									"Ubah Password"
								)}
							</button>

							<button
								onClick={handleCancelPasswordChange}
								disabled={isLoadingPassword}
								className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
								{language.code === "en" ? "Cancel" : "Batal"}
							</button>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
