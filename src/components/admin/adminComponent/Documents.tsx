import { useState, useMemo } from "react";
import {
	Search,
	Upload,
	X,
	Check,
	FileText,
	Trash2,
	Edit,
	Download,
} from "lucide-react";
import { DocumentList } from "../../DocumentList";

interface Language {
	code: string;
	name: string;
}

interface Document {
	id: string;
	name: string;
	type: string;
	size: string;
	uploadDate: string;
	status: "completed" | "processing";
	uploadedBy?: string;
	documentType?: string;
}

const mockAllDocuments = [
	{
		id: "1",
		name: "Annual Report 2024",
		type: "PDF",
		size: "2.4 MB",
		uploadDate: "2024-01-15",
		status: "completed" as const,
		uploadedBy: "user@example.com",
		documentType: "Laporan Ringkasan",
	},
	{
		id: "2",
		name: "Financial Summary",
		type: "Excel",
		size: "1.2 MB",
		uploadDate: "2024-01-14",
		status: "completed" as const,
		uploadedBy: "admin@example.com",
		documentType: "Laporan Keuangan",
	},
	{
		id: "3",
		name: "Project Proposal",
		type: "Word",
		size: "800 KB",
		uploadDate: "2024-01-13",
		status: "processing" as const,
		uploadedBy: "user@example.com",
		documentType: "Proposal",
	},
	{
		id: "4",
		name: "Environmental Assessment",
		type: "PDF",
		size: "3.1 MB",
		uploadDate: "2024-01-12",
		status: "completed" as const,
		uploadedBy: "user2@example.com",
		documentType: "Life Cycle Assessment",
	},
];

const mockUserDocuments = [
	{
		id: "1",
		name: "Annual Report 2024",
		type: "PDF",
		size: "2.4 MB",
		uploadDate: "2024-01-15",
		status: "completed" as const,
	},
	{
		id: "2",
		name: "Financial Summary",
		type: "Excel",
		size: "1.2 MB",
		uploadDate: "2024-01-14",
		status: "completed" as const,
	},
	{
		id: "3",
		name: "Project Proposal",
		type: "Word",
		size: "800 KB",
		uploadDate: "2024-01-13",
		status: "processing" as const,
	},
];

interface DocumentsProps {
	language: Language;
	userRole?: "user" | "admin";
}

const documentTypes = [
	{
		id: "drkpl",
		label: "Laporan Ringkasan Kinerja Pengelolaan Lingkungan (DRKPL)",
	},
	{ id: "sdgs", label: "Laporan Verifikasi SDGs" },
	{ id: "lca", label: "Life Cycle Assessment" },
	{ id: "baseline", label: "Baseline/Rona Awal Keanekaragaman Hayati" },
	{ id: "evaluasi", label: "Evaluasi Keanekaragaman Hayati" },
	{ id: "mapping", label: "Social & Stakeholder Mapping" },
	{ id: "ikm", label: "Indeks Kepuasan Masyarakat (IKM)" },
	{ id: "rencana", label: "Rencana Strategis / Rencana Kerja" },
	{ id: "engagement", label: "Stakeholder Engagement & SLI" },
	{ id: "rea", label: "Rapid Environmental Assessment" },
	{
		id: "inovasi",
		label: "Inovasi Sosial dalam DRKPL/Buku Sosial / Lingkungan ISSBN",
	},
	{
		id: "jurnal",
		label: "Jurnal Sosial / Lingkungan Nasional dan/atau Internasional",
	},
];

export function Documents({ language, userRole = "user" }: DocumentsProps) {
	const [documents, setDocuments] = useState<Document[]>(
		userRole === "admin" ? mockAllDocuments : mockUserDocuments
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
	const [selectedFiles, setSelectedFiles] = useState<
		Record<string, File | null>
	>({});
	const [uploadedFiles, setUploadedFiles] = useState<
		Record<string, { name: string; size: string }>
	>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [editingDoc, setEditingDoc] = useState<string | null>(null);
	const [editForm, setEditForm] = useState({ name: "", type: "" });

	const handleDelete = (id: string) => {
		if (
			window.confirm(
				language.code === "en"
					? "Are you sure you want to delete this document?"
					: "Apakah Anda yakin ingin menghapus dokumen ini?"
			)
		) {
			setDocuments((prev) => prev.filter((doc) => doc.id !== id));
			showAlert(
				language.code === "en"
					? "Document deleted successfully"
					: "Dokumen berhasil dihapus",
				true
			);
		}
	};

	const handleEdit = (doc: Document) => {
		setEditingDoc(doc.id);
		setEditForm({ name: doc.name, type: doc.documentType || doc.type });
	};

	const handleSaveEdit = () => {
		if (editingDoc) {
			setDocuments((prev) =>
				prev.map((doc) =>
					doc.id === editingDoc
						? {
								...doc,
								name: editForm.name,
								documentType: editForm.type,
								type: editForm.type.split("/").pop()?.toUpperCase() || doc.type,
						  }
						: doc
				)
			);
			setEditingDoc(null);
			showAlert(
				language.code === "en"
					? "Document updated successfully"
					: "Dokumen berhasil diperbarui",
				true
			);
		}
	};

	const handleDownload = (doc: Document) => {
		showAlert(
			language.code === "en" ? "Downloading document..." : "Mengunduh dokumen...",
			false
		);
		setTimeout(() => {
			showAlert(
				language.code === "en" ? "Download completed" : "Unduhan selesai",
				true
			);
		}, 1000);
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const showAlert = (message: string, isSuccess: boolean = true) => {
		const alertDiv = document.createElement("div");
		alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
			isSuccess
				? "bg-green-50 border border-green-200"
				: "bg-blue-50 border border-blue-200"
		} animate-fade-in`;
		alertDiv.innerHTML = `
			<div class="flex items-center gap-3">
				<div class="${isSuccess ? "text-green-600" : "text-blue-600"}">
					${isSuccess ? "✓" : "ℹ"}
				</div>
				<p class="text-sm font-medium ${
					isSuccess ? "text-green-800" : "text-blue-800"
				}">${message}</p>
			</div>
		`;
		document.body.appendChild(alertDiv);
		setTimeout(() => {
			alertDiv.remove();
		}, 3000);
	};

	const showDeleteWarning = (docId: string, docLabel: string) => {
		if (
			window.confirm(
				language.code === "en"
					? `Are you sure you want to delete this file?\n\n"${docLabel}"\n\nThis action cannot be undone.`
					: `Apakah Anda yakin ingin menghapus file ini?\n\n"${docLabel}"\n\nTindakan ini tidak dapat dibatalkan.`
			)
		) {
			setUploadedFiles((prev) => {
				const newUploaded = { ...prev };
				delete newUploaded[docId];
				return newUploaded;
			});
			showAlert(
				language.code === "en"
					? "File successfully deleted"
					: "File berhasil dihapus",
				true
			);
		}
	};

	const handleFileSelect = (
		e: React.ChangeEvent<HTMLInputElement>,
		docId: string
	) => {
		const file = e.target.files?.[0];
		if (file) {
			const maxSize = 5 * 1024 * 1024;
			if (file.size > maxSize) {
				setErrors((prev) => ({
					...prev,
					[docId]:
						language.code === "en" ? "File exceeds 5 MB" : "File melebihi 5 MB",
				}));
				setSelectedFiles((prev) => ({ ...prev, [docId]: null }));
				e.target.value = "";
				return;
			}
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[docId];
				return newErrors;
			});
			setSelectedFiles((prev) => ({ ...prev, [docId]: file }));
		}
	};

	const handleRemoveFile = (docId: string) => {
		setSelectedFiles((prev) => {
			const newFiles = { ...prev };
			delete newFiles[docId];
			return newFiles;
		});
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[docId];
			return newErrors;
		});
		const input = document.getElementById(docId) as HTMLInputElement;
		if (input) input.value = "";
	};

	const handleUpload = (docId: string, docLabel: string) => {
		const file = selectedFiles[docId];
		if (!file) return;

		showAlert(
			language.code === "en" ? "Uploading file..." : "Mengunggah file...",
			false
		);

		setTimeout(() => {
			const newDocument: Document = {
				id: `${Date.now()}-${docId}`,
				name: file.name,
				type: file.name.split(".").pop()?.toUpperCase() || "FILE",
				size: formatFileSize(file.size),
				uploadDate: new Date().toISOString().split("T")[0],
				status: "completed" as const,
				...(userRole === "admin" && {
					uploadedBy: "current-user@example.com",
					documentType: docLabel,
				}),
			};

			setDocuments((prev) => [newDocument, ...prev]);
			setUploadedFiles((prev) => ({
				...prev,
				[docId]: {
					name: file.name,
					size: formatFileSize(file.size),
				},
			}));
			setSelectedFiles((prev) => {
				const newFiles = { ...prev };
				delete newFiles[docId];
				return newFiles;
			});

			const input = document.getElementById(docId) as HTMLInputElement;
			if (input) input.value = "";

			showAlert(
				language.code === "en"
					? "Success! File uploaded successfully."
					: "Berhasil! File berhasil diunggah.",
				true
			);
		}, 1500);
	};

	const filteredDocuments = useMemo(() => {
		return documents.filter(
			(doc) =>
				doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(doc.documentType &&
					doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(doc.uploadedBy &&
					doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	}, [documents, searchTerm]);

	const paginatedDocuments = filteredDocuments.slice(0, entriesPerPage);

	return (
		<div className="p-8 space-y-8 bg-gradient-to-br from-background via-background to-secondary/5 rounded-lg">
			<header>
				<h1 className="text-3xl font-bold mb-2">
					{language.code === "en" ? "Documents" : "Dokumen"}
				</h1>
				<p className="text-muted-foreground text-lg">
					{userRole === "admin"
						? language.code === "en"
							? "Manage all documents"
							: "Kelola semua dokumen"
						: language.code === "en"
						? "Upload and manage your documents"
						: "Unggah dan kelola dokumen Anda"}
				</p>
			</header>

			{userRole === "admin" ? (
				<section className="bg-background border border-border rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						{language.code === "en" ? "All Documents" : "Semua Dokumen"}
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse border border-border">
							<thead>
								<tr className="bg-gray-50">
									<th className="border border-border p-3 text-left">
										{language.code === "en" ? "File Name" : "Nama Berkas"}
									</th>
									<th className="border border-border p-3 text-left">
										{language.code === "en" ? "File Type" : "Jenis Berkas"}
									</th>
									<th className="border border-border p-3 text-left">
										{language.code === "en" ? "Uploaded By" : "Diunggah Oleh"}
									</th>
									<th className="border border-border p-3 text-left">
										{language.code === "en" ? "Upload Date" : "Tanggal Unggah"}
									</th>
									<th className="border border-border p-3 text-left">
										{language.code === "en" ? "Actions" : "Aksi"}
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedDocuments.map((doc) => (
									<tr key={doc.id} className="hover:bg-gray-50">
										<td className="border border-border p-3">
											{editingDoc === doc.id ? (
												<input
													type="text"
													value={editForm.name}
													onChange={(e) =>
														setEditForm((prev) => ({ ...prev, name: e.target.value }))
													}
													className="w-full px-2 py-1 border border-gray-300 rounded"
												/>
											) : (
												doc.name
											)}
										</td>
										<td className="border border-border p-3">
											{editingDoc === doc.id ? (
												<input
													type="text"
													value={editForm.type}
													onChange={(e) =>
														setEditForm((prev) => ({ ...prev, type: e.target.value }))
													}
													className="w-full px-2 py-1 border border-gray-300 rounded"
												/>
											) : (
												doc.documentType || doc.type
											)}
										</td>
										<td className="border border-border p-3">{doc.uploadedBy}</td>
										<td className="border border-border p-3">{doc.uploadDate}</td>
										<td className="border border-border p-3">
											<div className="flex gap-2">
												{editingDoc === doc.id ? (
													<>
														<button
															onClick={handleSaveEdit}
															className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
															✓
														</button>
														<button
															onClick={() => setEditingDoc(null)}
															className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
															✗
														</button>
													</>
												) : (
													<>
														<button
															onClick={() => handleEdit(doc)}
															className="p-1 text-blue-600 hover:bg-blue-50 rounded"
															title={language.code === "en" ? "Edit" : "Edit"}>
															<Edit size={16} />
														</button>
														<button
															onClick={() => handleDownload(doc)}
															className="p-1 text-green-600 hover:bg-green-50 rounded"
															title={language.code === "en" ? "Download" : "Unduh"}>
															<Download size={16} />
														</button>
														<button
															onClick={() => handleDelete(doc.id)}
															className="p-1 text-red-600 hover:bg-red-50 rounded"
															title={language.code === "en" ? "Delete" : "Hapus"}>
															<Trash2 size={16} />
														</button>
													</>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			) : (
				<section className="bg-background border border-border rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						{language.code === "en" ? "Upload Documents" : "Unggah Dokumen"}
					</h2>
					<p className="text-sm text-muted-foreground mb-6">
						{language.code === "en"
							? "Please select and upload each document individually. Maximum file size: 5 MB"
							: "Silakan pilih dan unggah setiap dokumen satu per satu. Ukuran file maksimal: 5 MB"}
					</p>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6 items-start content-start">
						{documentTypes.map((docType) => (
							<div key={docType.id} className="flex flex-col min-h-0">
								<label
									htmlFor={docType.id}
									className="block text-sm font-medium text-foreground mb-2 flex-shrink-0">
									{docType.label}
								</label>

								<div className="flex-1 min-h-0">
									{!selectedFiles[docType.id] && !uploadedFiles[docType.id] && (
										<input
											id={docType.id}
											type="file"
											onChange={(e) => handleFileSelect(e, docType.id)}
											accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
											className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer border border-border rounded-lg cursor-pointer bg-background"
										/>
									)}

									{selectedFiles[docType.id] && (
										<div className="flex items-start gap-3 p-3 bg-background border-2 border-green-500 rounded-lg">
											<div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
												<FileText className="w-5 h-5 text-blue-600" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground truncate">
													{selectedFiles[docType.id]?.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{selectedFiles[docType.id] &&
														formatFileSize(selectedFiles[docType.id]!.size)}
												</p>
											</div>
											<div className="flex items-center gap-2 flex-shrink-0">
												<button
													onClick={() => handleUpload(docType.id, docType.label)}
													className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-1.5">
													<Upload size={14} />
													{language.code === "en" ? "Upload" : "Unggah"}
												</button>
												<button
													onClick={() => handleRemoveFile(docType.id)}
													className="p-1.5 hover:bg-red-100 rounded-lg transition-colors">
													<X size={18} className="text-red-600" />
												</button>
											</div>
										</div>
									)}

									{uploadedFiles[docType.id] && !selectedFiles[docType.id] && (
										<div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
											<div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
												<Check className="w-5 h-5 text-green-600" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-green-700 truncate">
													{uploadedFiles[docType.id].name}
												</p>
												<p className="text-xs text-green-600">
													{uploadedFiles[docType.id].size}
												</p>
											</div>
											<button
												onClick={() => showDeleteWarning(docType.id, docType.label)}
												className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-1.5 flex-shrink-0">
												<Trash2 size={14} />
												{language.code === "en" ? "Delete" : "Hapus"}
											</button>
										</div>
									)}

									{errors[docType.id] && (
										<p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 mt-2">
											{errors[docType.id]}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{(userRole === "user" || paginatedDocuments.length > 0) && (
				<section className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
					<div className="flex-1 w-full">
						<div className="relative">
							<Search
								className="absolute left-3 top-2 text-muted-foreground"
								size={20}
							/>
							<input
								placeholder={
									language.code === "en" ? "Search documents..." : "Cari dokumen..."
								}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 w-full px-3 py-2 border border-border rounded-lg bg-background"
							/>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<select
							value={entriesPerPage}
							onChange={(e) => setEntriesPerPage(Number(e.target.value))}
							className="px-3 py-2 border border-border rounded-lg bg-background text-sm">
							{[5, 10, 20, 50].map((num) => (
								<option key={num} value={num}>
									{language.code === "en" ? `Show ${num}` : `Tampilkan ${num}`}
								</option>
							))}
						</select>
					</div>
				</section>
			)}

			{userRole === "user" && (
				<section>
					<DocumentList
						documents={paginatedDocuments}
						onDelete={handleDelete}
						searchTerm={searchTerm}
					/>
				</section>
			)}

			<style>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}
			`}</style>
		</div>
	);
}
