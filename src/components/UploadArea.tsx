import { useState } from "react";
import { Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface UploadAreaProps {
	onFilesSelected: (files: File[]) => void;
}

const ALLOWED_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface FileStatus {
	file: File;
	status: "uploading" | "completed" | "failed";
	progress: number;
}

export function UploadArea({ onFilesSelected }: UploadAreaProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<FileStatus[]>([]);
	const [error, setError] = useState<string>("");

	const validateFiles = (files: FileList): File[] => {
		const validFiles: File[] = [];
		setError("");

		Array.from(files).forEach((file) => {
			if (!ALLOWED_TYPES.includes(file.type)) {
				setError(
					`${file.name} is not a supported file type. Please upload PDF, Word, or Excel files.`
				);
				return;
			}
			if (file.size > MAX_FILE_SIZE) {
				setError(`${file.name} is too large. Maximum file size is 10MB.`);
				return;
			}
			validFiles.push(file);
		});

		return validFiles;
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const files = validateFiles(e.dataTransfer.files);
		if (files.length > 0) {
			setUploadedFiles(
				files.map((file) => ({ file, status: "uploading", progress: 0 }))
			);
			onFilesSelected(files);
			simulateUpload(files);
		}
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = validateFiles(e.target.files);
			if (files.length > 0) {
				setUploadedFiles(
					files.map((file) => ({ file, status: "uploading", progress: 0 }))
				);
				onFilesSelected(files);
				simulateUpload(files);
			}
		}
	};

	const removeFile = (index: number) => {
		setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
	};

	const simulateUpload = (files: File[]) => {
		files.forEach((file, idx) => {
			const interval = setInterval(() => {
				setUploadedFiles((prev) => {
					const updatedFiles = [...prev];
					const fileStatus = updatedFiles[idx];
					if (fileStatus.progress < 100) {
						fileStatus.progress += 10;
					} else {
						fileStatus.status = "completed";
						clearInterval(interval);
					}
					return updatedFiles;
				});
			}, 500);
		});
	};

	return (
		<div className="space-y-4">
			<div
				className={`border-2 border-dashed transition-all cursor-pointer rounded-lg ${
					isDragging
						? "border-primary bg-primary/5"
						: "border-border hover:border-primary"
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}>
				<div className="p-12">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
							<Upload className="text-primary" size={32} />
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">
							Drag and drop your files here
						</h3>
						<p className="text-muted-foreground mb-4">
							Supported formats: PDF, Word, Excel (Max 10MB per file)
						</p>
						<label>
							<input
								type="file"
								multiple
								accept=".pdf,.doc,.docx,.xls,.xlsx"
								onChange={handleFileInput}
								className="hidden"
							/>
							<button className="bg-primary hover:bg-accent text-primary-foreground cursor-pointer px-4 py-2 rounded-lg">
								Choose Files
							</button>
						</label>
					</div>
				</div>
			</div>

			{error && (
				<div className="flex items-center gap-2 bg-destructive/10 text-destructive p-3 rounded-lg">
					<AlertCircle size={18} />
					<span className="text-sm">{error}</span>
				</div>
			)}

			{uploadedFiles.length > 0 && (
				<div className="border-0 shadow-md rounded-lg">
					<div className="p-4">
						<h4 className="font-semibold text-foreground mb-3">
							Ready to upload ({uploadedFiles.length})
						</h4>
						<div className="space-y-2">
							{uploadedFiles.map((fileStatus, idx) => (
								<div
									key={idx}
									className="flex items-center justify-between p-3 bg-secondary rounded-lg">
									<div className="flex items-center gap-2">
										{fileStatus.status === "uploading" ? (
											<Loader2 className="animate-spin text-primary" size={18} />
										) : (
											<CheckCircle size={18} className="text-primary" />
										)}
										<div className="text-left">
											<p className="text-sm font-medium text-foreground">
												{fileStatus.file.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{(fileStatus.file.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
									</div>
									<div className="text-xs text-muted-foreground">
										{fileStatus.status === "uploading" ? `${fileStatus.progress}%` : ""}
									</div>
									<button
										onClick={() => removeFile(idx)}
										className="text-muted-foreground hover:text-destructive transition-colors">
										✕
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
