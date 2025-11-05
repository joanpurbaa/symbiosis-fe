interface Language {
	code: string;
	name: string;
}

interface ProfileProps {
	language: Language;
}

export function Profile({ language }: ProfileProps) {
	return (
		<div className="p-8 space-y-8 bg-gradient-to-br from-background via-background to-secondary/5 rounded-lg">
			<header>
				<h1 className="text-3xl font-bold mb-2">
					{language.code === "en" ? "Profile" : "Profil"}
				</h1>
				<p className="text-muted-foreground text-lg">
					{language.code === "en"
						? "Manage your profile information"
						: "Kelola informasi profil Anda"}
				</p>
			</header>

			<section className="bg-background border border-border rounded-lg p-6">
				<h2 className="text-xl font-semibold mb-4">
					{language.code === "en" ? "Profile Information" : "Informasi Profil"}
				</h2>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							{language.code === "en" ? "Name" : "Nama"}
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-border rounded-lg bg-background"
							placeholder={language.code === "en" ? "Your name" : "Nama Anda"}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							Email
						</label>
						<input
							type="email"
							className="w-full px-3 py-2 border border-border rounded-lg bg-background"
							placeholder="your@email.com"
						/>
					</div>
					<button className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors">
						{language.code === "en" ? "Update Profile" : "Perbarui Profil"}
					</button>
				</div>
			</section>
		</div>
	);
}
