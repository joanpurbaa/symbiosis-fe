import { useState } from "react";

interface Language {
	code: string;
	name: string;
}

interface ProfileData {
	name: string;
	position: string;
	email: string;
	username: string;
	companyAddress: string;
	workField: string;
}

interface ProfileProps {
	language: Language;
}

export function Profile({ language }: ProfileProps) {
	const [profileData, setProfileData] = useState<ProfileData>({
		name: "John Doe",
		position: "Software Engineer",
		email: "john.doe@company.com",
		username: "johndoe",
		companyAddress: "Jl. Sudirman No. 123, Jakarta Selatan",
		workField: "Technology",
	});

	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (field: keyof ProfileData, value: string) => {
		setProfileData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSaveProfile = async () => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("Profile saved:", profileData);
			setIsEditing(false);
		} catch (error) {
			console.error("Error saving profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
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
				{!isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors">
						{language.code === "en" ? "Edit Profile" : "Edit Profil"}
					</button>
				)}
			</header>

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
							disabled={!isEditing}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background ${
								!isEditing ? "opacity-70 cursor-not-allowed" : ""
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
							value={profileData.position}
							onChange={(e) => handleInputChange("position", e.target.value)}
							disabled={!isEditing}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background ${
								!isEditing ? "opacity-70 cursor-not-allowed" : ""
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
							value={profileData.companyAddress}
							onChange={(e) => handleInputChange("companyAddress", e.target.value)}
							disabled={!isEditing}
							rows={3}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background resize-none ${
								!isEditing ? "opacity-70 cursor-not-allowed" : ""
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
							value={profileData.workField}
							onChange={(e) => handleInputChange("workField", e.target.value)}
							disabled={!isEditing}
							className={`w-full px-3 py-2 border border-border rounded-lg bg-background ${
								!isEditing ? "opacity-70 cursor-not-allowed" : ""
							}`}
							placeholder={
								language.code === "en" ? "Your work field" : "Bidang pekerjaan Anda"
							}
						/>
					</div>
				</div>

				{isEditing && (
					<div className="flex gap-3 pt-6 border-t border-border">
						<button
							onClick={handleSaveProfile}
							disabled={isLoading}
							className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
							{isLoading ? (
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
							onClick={handleCancelEdit}
							disabled={isLoading}
							className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
							{language.code === "en" ? "Cancel" : "Batal"}
						</button>
					</div>
				)}
			</section>
		</div>
	);
}
