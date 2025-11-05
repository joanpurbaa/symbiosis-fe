import { useState, useMemo, useEffect } from "react";
import {
	Plus,
	Edit2,
	Trash2,
	X,
	Save,
	Search,
} from "lucide-react";

interface Language {
	code: string;
	name: string;
}

interface User {
	id: string;
	nama: string;
	jabatan: string;
	email: string;
	username: string;
	alamatPerusahaan: string;
	bidangPekerjaan: string;
	joinDate: string;
}

const initialUsers: User[] = [
	{
		id: "1",
		nama: "John Doe",
		jabatan: "Manager",
		email: "john@symbiosis.com",
		username: "johndoe",
		alamatPerusahaan: "Jl. Sudirman No. 123, Jakarta",
		bidangPekerjaan: "Teknologi Informasi",
		joinDate: "2024-01-15",
	},
	{
		id: "2",
		nama: "Jane Smith",
		jabatan: "Staff",
		email: "jane@symbiosis.com",
		username: "janesmith",
		alamatPerusahaan: "Jl. Gatot Subroto No. 456, Jakarta",
		bidangPekerjaan: "Keuangan",
		joinDate: "2024-02-20",
	},
];

interface UserManagementProps {
	language: Language;
}

export function UserManagement({ language }: UserManagementProps) {
	const [users, setUsers] = useState<User[]>(initialUsers);
	const [isOpen, setIsOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"nama" | "email" | "date">("nama");
	const [filterBidang, setFilterBidang] = useState<string>("all");
	const [entriesPerPage, setEntriesPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const [formData, setFormData] = useState({
		nama: "",
		jabatan: "",
		email: "",
		username: "",
		alamatPerusahaan: "",
		bidangPekerjaan: "",
	});

	const uniqueBidang = useMemo(
		() => Array.from(new Set(users.map((u) => u.bidangPekerjaan))),
		[users]
	);

	const filteredAndSortedUsers = useMemo(() => {
		const filtered = users.filter((user) => {
			const matchesSearch =
				user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.username.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesBidang =
				filterBidang === "all" || user.bidangPekerjaan === filterBidang;

			return matchesSearch && matchesBidang;
		});

		filtered.sort((a, b) => {
			if (sortBy === "nama") return a.nama.localeCompare(b.nama);
			if (sortBy === "email") return a.email.localeCompare(b.email);
			if (sortBy === "date")
				return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
			return 0;
		});

		return filtered;
	}, [users, searchQuery, sortBy, filterBidang]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSortedUsers.length / entriesPerPage)
	);

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages);
		if (filteredAndSortedUsers.length === 0) setCurrentPage(1);
	}, [totalPages, filteredAndSortedUsers.length]);

	useEffect(() => {
		setCurrentPage(1);
	}, [entriesPerPage, searchQuery, filterBidang, sortBy]);

	const paginatedUsers = filteredAndSortedUsers.slice(
		(currentPage - 1) * entriesPerPage,
		currentPage * entriesPerPage
	);

	const handleAddUser = () => {
		if (formData.nama && formData.email && formData.username) {
			if (editingId) {
				setUsers(
					users.map((u) => (u.id === editingId ? { ...u, ...formData } : u))
				);
				setEditingId(null);
			} else {
				setUsers([
					...users,
					{
						id: Date.now().toString(),
						...formData,
						joinDate: new Date().toISOString().split("T")[0],
					},
				]);
			}
			setFormData({
				nama: "",
				jabatan: "",
				email: "",
				username: "",
				alamatPerusahaan: "",
				bidangPekerjaan: "",
			});
			setIsOpen(false);
		}
	};

	const handleEdit = (user: User) => {
		setFormData({
			nama: user.nama,
			jabatan: user.jabatan,
			email: user.email,
			username: user.username,
			alamatPerusahaan: user.alamatPerusahaan,
			bidangPekerjaan: user.bidangPekerjaan,
		});
		setEditingId(user.id);
		setIsOpen(true);
	};

	const handleDelete = (id: string) =>
		setUsers(users.filter((u) => u.id !== id));

	const handleClose = () => {
		setIsOpen(false);
		setEditingId(null);
		setFormData({
			nama: "",
			jabatan: "",
			email: "",
			username: "",
			alamatPerusahaan: "",
			bidangPekerjaan: "",
		});
	};

	const globalIndex = (indexOnPage: number) =>
		(currentPage - 1) * entriesPerPage + indexOnPage + 1;

	return (
		<div className="bg-white p-6 md:p-8 space-y-6 w-full box-border rounded-md">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1">
						{language.code === "en" ? "User Management" : "Manajemen Pengguna"}
					</h1>
					<p className="text-muted-foreground text-sm md:text-lg">
						{language.code === "en"
							? "Manage system users and permissions"
							: "Kelola pengguna sistem dan izin"}
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setIsOpen(true)}
						className="gap-2 shadow px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center">
						<Plus size={16} />
						{language.code === "en" ? "Add User" : "Tambah Pengguna"}
					</button>
				</div>
			</div>

			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="mb-4">
							<div className="text-lg font-semibold">
								{editingId
									? language.code === "en"
										? "Edit User"
										: "Edit Pengguna"
									: language.code === "en"
									? "Add User"
									: "Tambah Pengguna"}
							</div>
							<div className="text-sm text-muted-foreground">
								{editingId
									? language.code === "en"
										? "Update user information"
										: "Perbarui informasi pengguna"
									: language.code === "en"
									? "Add a new user to the system"
									: "Tambahkan pengguna baru ke sistem"}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium">
									{language.code === "en" ? "Name" : "Nama"}
								</label>
								<input
									value={formData.nama}
									onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
									placeholder={language.code === "en" ? "Enter name" : "Masukkan nama"}
									className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>

							<div>
								<label className="text-sm font-medium">
									{language.code === "en" ? "Position" : "Jabatan"}
								</label>
								<input
									value={formData.jabatan}
									onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
									placeholder={
										language.code === "en" ? "Enter position" : "Masukkan jabatan"
									}
									className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>

							<div>
								<label className="text-sm font-medium">Email</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									placeholder={language.code === "en" ? "Enter email" : "Masukkan email"}
									className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>

							<div>
								<label className="text-sm font-medium">Username</label>
								<input
									value={formData.username}
									onChange={(e) =>
										setFormData({ ...formData, username: e.target.value })
									}
									placeholder={
										language.code === "en" ? "Enter username" : "Masukkan username"
									}
									className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>

							<div>
								<label className="text-sm font-medium">
									{language.code === "en" ? "Field of Work" : "Bidang Pekerjaan"}
								</label>
								<input
									value={formData.bidangPekerjaan}
									onChange={(e) =>
										setFormData({ ...formData, bidangPekerjaan: e.target.value })
									}
									placeholder={
										language.code === "en"
											? "Enter field of work"
											: "Masukkan bidang pekerjaan"
									}
									className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="text-sm font-medium">
									{language.code === "en" ? "Company Address" : "Alamat Perusahaan"}
								</label>
								<textarea
									value={formData.alamatPerusahaan}
									onChange={(e) =>
										setFormData({ ...formData, alamatPerusahaan: e.target.value })
									}
									placeholder={
										language.code === "en"
											? "Enter company address"
											: "Masukkan alamat perusahaan"
									}
									rows={3}
									className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
								/>
							</div>
						</div>

						<div className="flex gap-3 pt-6">
							<button
								onClick={handleAddUser}
								className="gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center">
								<Save size={16} />
								{language.code === "en" ? "Save" : "Simpan"}
							</button>
							<button
								onClick={handleClose}
								className="gap-2 px-4 py-2 border border-border rounded-lg flex items-center">
								<X size={16} />
								{language.code === "en" ? "Cancel" : "Batal"}
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="border-0 shadow-lg rounded-lg">
				<div className="p-6">
					<div className="text-lg font-semibold">
						{language.code === "en" ? "User Management" : "Manajemen Pengguna"}
					</div>
					<div className="text-sm text-muted-foreground">
						{language.code === "en"
							? "List of all system users"
							: "Daftar semua pengguna sistem"}
					</div>
				</div>

				<div className="p-6 space-y-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div className="relative flex-1">
							<Search
								className="absolute left-3 top-3 text-muted-foreground"
								size={18}
							/>
							<input
								placeholder={
									language.code === "en"
										? "Search by name, email, or username..."
										: "Cari berdasarkan nama, email, atau username..."
								}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 w-full px-3 py-2 border border-border rounded-lg bg-background"
							/>
						</div>

						<div className="flex flex-wrap items-center gap-2 md:gap-3 max-w-full">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value as "nama" | "email" | "date")}
								className="px-3 py-2 text-sm border border-border rounded-lg bg-background min-w-[140px]">
								<option value="nama">
									{language.code === "en" ? "Sort by Name" : "Urutkan Nama"}
								</option>
								<option value="email">
									{language.code === "en" ? "Sort by Email" : "Urutkan Email"}
								</option>
								<option value="date">
									{language.code === "en" ? "Sort by Date" : "Urutkan Tanggal"}
								</option>
							</select>

							<select
								value={filterBidang}
								onChange={(e) => setFilterBidang(e.target.value)}
								className="px-3 py-2 text-sm border border-border rounded-lg bg-background min-w-[160px]">
								<option value="all">
									{language.code === "en" ? "All Fields" : "Semua Bidang"}
								</option>
								{uniqueBidang.map((bidang) => (
									<option key={bidang} value={bidang}>
										{bidang}
									</option>
								))}
							</select>

							<select
								value={entriesPerPage}
								onChange={(e) => setEntriesPerPage(Number(e.target.value))}
								className="px-3 py-2 text-sm border border-border rounded-lg bg-background min-w-[110px]">
								{[5, 10, 20, 50].map((n) => (
									<option key={n} value={n}>
										{language.code === "en" ? `Show ${n}` : `Tampilkan ${n}`}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead className="bg-card/80 sticky top-0">
								<tr className="border-b border-border/50">
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground w-[64px]">
										No.
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										{language.code === "en" ? "Name" : "Nama"}
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										{language.code === "en" ? "Position" : "Jabatan"}
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										Email
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										Username
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										Password
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										{language.code === "en" ? "Company Address" : "Alamat Perusahaan"}
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										{language.code === "en" ? "Field of Work" : "Bidang Pekerjaan"}
									</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
										{language.code === "en" ? "Actions" : "Aksi"}
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedUsers.length > 0 ? (
									paginatedUsers.map((user, idx) => (
										<tr
											key={user.id}
											className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
											<td className="py-3 px-4 text-sm text-muted-foreground">
												{globalIndex(idx)}
											</td>
											<td className="py-3 px-4 font-medium text-foreground">
												{user.nama}
											</td>
											<td className="py-3 px-4 text-muted-foreground">{user.jabatan}</td>
											<td className="py-3 px-4 text-muted-foreground">{user.email}</td>
											<td className="py-3 px-4 text-muted-foreground">{user.username}</td>
											<td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
												{user.alamatPerusahaan}
											</td>
											<td className="py-3 px-4">
												<span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
													{user.bidangPekerjaan}
												</span>
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center gap-2">
													<button
														onClick={() => handleEdit(user)}
														className="gap-1 px-2 py-1 text-sm border border-border rounded hover:bg-primary/10 flex items-center"
														aria-label={
															language.code === "en"
																? `Edit ${user.nama}`
																: `Ubah ${user.nama}`
														}>
														<Edit2 size={14} />
														<span className="hidden md:inline">
															{language.code === "en" ? "Edit" : "Ubah"}
														</span>
													</button>
													<button
														onClick={() => handleDelete(user.id)}
														className="gap-1 px-2 py-1 text-sm border border-border rounded text-red-600 hover:bg-red-50 flex items-center"
														aria-label={
															language.code === "en"
																? `Delete ${user.nama}`
																: `Hapus ${user.nama}`
														}>
														<Trash2 size={14} />
														<span className="hidden md:inline">
															{language.code === "en" ? "Delete" : "Hapus"}
														</span>
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={9} className="text-center py-8 text-muted-foreground">
											{language.code === "en"
												? "No users found"
												: "Tidak ada pengguna yang ditemukan"}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-4 text-sm text-muted-foreground">
						<div>
							{language.code === "en"
								? `Showing ${Math.min(
										filteredAndSortedUsers.length,
										paginatedUsers.length
								  )} of ${filteredAndSortedUsers.length} users`
								: `Menampilkan ${Math.min(
										filteredAndSortedUsers.length,
										paginatedUsers.length
								  )} dari ${filteredAndSortedUsers.length} pengguna`}
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="px-3 py-1 border border-border rounded disabled:opacity-50"
								aria-label={
									language.code === "en" ? "Previous page" : "Halaman sebelumnya"
								}>
								{language.code === "en" ? "Prev" : "Sebelum"}
							</button>

							<div className="px-3 py-1 text-sm bg-muted/5 rounded-md">
								{language.code === "en"
									? `Page ${currentPage} of ${totalPages}`
									: `Hal. ${currentPage} dari ${totalPages}`}
							</div>

							<button
								onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="px-3 py-1 border border-border rounded disabled:opacity-50"
								aria-label={
									language.code === "en" ? "Next page" : "Halaman berikutnya"
								}>
								{language.code === "en" ? "Next" : "Berikut"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
