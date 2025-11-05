import { useState, useMemo, useEffect } from "react";
import { File, Trash2, Download } from "lucide-react";

interface Document {
	id: string;
	name: string;
	type: string;
	size: string;
	uploadDate: string;
	status: "completed" | "processing";
	uploadedBy?: string;
	uploaderName?: string;
	uploaderUsername?: string;
}

interface DocumentListProps {
	documents: Document[];
	onDelete: (id: string) => void;
	searchTerm: string;
	paginate?: boolean;
	entriesPerPage?: number;
}

export function DocumentList({
	documents,
	onDelete,
	searchTerm,
	paginate = true,
	entriesPerPage = 10,
}: DocumentListProps) {
	const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
	const [filterType, setFilterType] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState<number>(1);

	const documentTypes = useMemo(
		() => Array.from(new Set(documents.map((doc) => doc.type))),
		[documents]
	);

	const filteredSorted = useMemo(() => {
		const filtered = documents.filter((doc) => {
			const matchesSearch = doc.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesType = filterType === "all" || doc.type === filterType;
			return matchesSearch && matchesType;
		});

		const sorted = filtered.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "size": {
					const as = parseFloat(a.size.replace(/[^0-9.,]/g, "").replace(",", "."));
					const bs = parseFloat(b.size.replace(/[^0-9.,]/g, "").replace(",", "."));
					return bs - as;
				}
				case "date":
				default:
					return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
			}
		});

		return sorted;
	}, [documents, searchTerm, filterType, sortBy]);

	const totalItems = filteredSorted.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / entriesPerPage));

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, filterType, sortBy, entriesPerPage]);

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [currentPage, totalPages]);

	const paginatedDocuments = useMemo(() => {
		if (!paginate) return filteredSorted;
		const start = (currentPage - 1) * entriesPerPage;
		return filteredSorted.slice(start, start + entriesPerPage);
	}, [filteredSorted, currentPage, entriesPerPage, paginate]);

	const globalIndex = (indexOnPage: number) => {
		return paginate
			? (currentPage - 1) * entriesPerPage + indexOnPage + 1
			: indexOnPage + 1;
	};

	return (
		<div className="border-0 shadow-md rounded-lg">
			<div className="p-6">
				<div className="flex items-center justify-between w-full gap-4">
					<div>
						<div className="text-lg font-semibold">Your Documents</div>
						<div className="text-sm text-muted-foreground">
							{totalItems} documents found
						</div>
					</div>

					<div className="flex items-center gap-2">
						<select
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
							className="px-3 py-2 rounded-lg bg-secondary text-foreground border border-border text-sm">
							<option value="all">All Types</option>
							{documentTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as "date" | "name" | "size")}
							className="px-3 py-2 rounded-lg bg-secondary text-foreground border border-border text-sm">
							<option value="date">Sort by Date</option>
							<option value="name">Sort by Name</option>
							<option value="size">Sort by Size</option>
						</select>
					</div>
				</div>
			</div>

			<div className="p-6 pt-0">
				{paginatedDocuments.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-muted-foreground">No documents found</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										#
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Name
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Type
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Size
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Upload Date
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Uploaded By
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Status
									</th>
									<th className="text-left py-3 px-4 font-semibold text-foreground">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedDocuments.map((doc, idx) => (
									<tr
										key={doc.id}
										className="border-b border-border hover:bg-secondary transition-colors">
										<td className="py-3 px-4 text-muted-foreground">
											{globalIndex(idx)}
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-2">
												<File className="text-primary" size={18} />
												<span className="text-foreground font-medium">{doc.name}</span>
											</div>
										</td>
										<td className="py-3 px-4 text-muted-foreground">{doc.type}</td>
										<td className="py-3 px-4 text-muted-foreground">{doc.size}</td>
										<td className="py-3 px-4 text-muted-foreground">{doc.uploadDate}</td>
										<td className="py-3 px-4">
											{doc.uploaderName && doc.uploaderUsername ? (
												<div className="flex flex-col">
													<span className="text-sm font-medium text-foreground">
														{doc.uploaderName}
													</span>
													<span className="text-xs text-muted-foreground">
														@{doc.uploaderUsername}
													</span>
												</div>
											) : doc.uploadedBy ? (
												<span className="text-sm text-muted-foreground">
													{doc.uploadedBy}
												</span>
											) : (
												<span className="text-sm text-muted-foreground">-</span>
											)}
										</td>
										<td className="py-3 px-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${
													doc.status === "completed"
														? "bg-primary/10 text-primary"
														: "bg-accent/10 text-accent"
												}`}>
												{doc.status === "completed" ? "Completed" : "Processing"}
											</span>
										</td>
										<td className="py-3 px-4">
											<div className="flex gap-2">
												<button
													className="p-1 text-primary hover:bg-secondary rounded"
													aria-label={`Download ${doc.name}`}>
													<Download size={16} />
												</button>
												<button
													className="p-1 text-destructive hover:bg-secondary rounded"
													onClick={() => onDelete(doc.id)}
													aria-label={`Delete ${doc.name}`}>
													<Trash2 size={16} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{paginate && totalItems > 0 && (
					<div className="flex items-center justify-between gap-4 mt-4 text-sm text-muted-foreground">
						<div>
							Showing {Math.min(entriesPerPage, paginatedDocuments.length)} of{" "}
							{totalItems} documents
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="px-3 py-1 border border-border rounded disabled:opacity-50">
								Prev
							</button>

							<div className="px-3 py-1 bg-muted/5 rounded-md">
								Page {currentPage} of {totalPages}
							</div>

							<button
								onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="px-3 py-1 border border-border rounded disabled:opacity-50">
								Next
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
