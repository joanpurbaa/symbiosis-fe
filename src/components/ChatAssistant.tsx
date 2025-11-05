import { useState, useRef, useEffect } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";

interface Language {
	code: string;
	name: string;
}

interface Message {
	id: string;
	role: "user" | "bot";
	content: string;
	timestamp: Date;
}

const BOT_RESPONSES: Record<string, Record<string, string>> = {
	en: {
		upload:
			"You can upload documents by going to the Documents page. Supported formats include PDF, Word, and Excel files.",
		documents:
			"You currently have 148 documents stored. You can view and manage them in the Documents section.",
		storage: "You're using 2.4 GB out of 10 GB available storage.",
		sroi:
			"The SROI Calculator helps you measure the social return on investment. Visit the SROI Calculator page to get started.",
		help:
			"I can help you with document management, storage information, SROI calculations, and more. What would you like to know?",
		default:
			"I'm here to help! You can ask me about documents, storage, SROI calculations, or anything else related to your dashboard.",
	},
	id: {
		upload:
			"Anda dapat mengunggah dokumen dengan membuka halaman Dokumen. Format yang didukung termasuk PDF, Word, dan file Excel.",
		documents:
			"Anda saat ini memiliki 148 dokumen yang disimpan. Anda dapat melihat dan mengelolanya di bagian Dokumen.",
		storage: "Anda menggunakan 2,4 GB dari 10 GB penyimpanan yang tersedia.",
		sroi:
			"Kalkulator SROI membantu Anda mengukur pengembalian investasi sosial. Kunjungi halaman Kalkulator SROI untuk memulai.",
		help:
			"Saya dapat membantu Anda dengan manajemen dokumen, informasi penyimpanan, perhitungan SROI, dan banyak lagi. Apa yang ingin Anda ketahui?",
		default:
			"Saya di sini untuk membantu! Anda dapat bertanya kepada saya tentang dokumen, penyimpanan, perhitungan SROI, atau apa pun yang terkait dengan dasbor Anda.",
	},
};

interface ChatAssistantProps {
	language: Language;
}

export function ChatAssistant({ language }: ChatAssistantProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			role: "bot",
			content:
				language.code === "en"
					? "Hello! I'm your document assistant. How can I help you today?"
					: "Halo! Saya adalah asisten dokumen Anda. Bagaimana saya bisa membantu Anda hari ini?",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const getBotResponse = (userMessage: string): string => {
		const lowerMessage = userMessage.toLowerCase();
		const responses = BOT_RESPONSES[language.code];

		if (lowerMessage.includes("upload") || lowerMessage.includes("unggah"))
			return responses.upload;
		if (lowerMessage.includes("document") || lowerMessage.includes("dokumen"))
			return responses.documents;
		if (lowerMessage.includes("storage") || lowerMessage.includes("penyimpanan"))
			return responses.storage;
		if (lowerMessage.includes("sroi")) return responses.sroi;
		if (lowerMessage.includes("help") || lowerMessage.includes("bantuan"))
			return responses.help;

		return responses.default;
	};

	const handleSendMessage = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 700));

		const botMessage: Message = {
			id: (Date.now() + 1).toString(),
			role: "bot",
			content: getBotResponse(input),
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, botMessage]);
		setIsLoading(false);
	};

	return (
		<div className="border-0 shadow-lg flex flex-col h-full rounded-xl bg-gradient-to-br from-card to-card/95 overflow-hidden">
			<div className="pb-4 border-b border-border/50 p-6">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-green-100 rounded-lg">
						<MessageCircle className="text-green-800" size={18} />
					</div>
					<div>
						<div className="text-lg font-semibold">Chat Assistant</div>
						<div className="text-xs text-muted-foreground">AI Assistant</div>
					</div>
				</div>
			</div>

			<div className="flex-1 flex flex-col min-h-0 p-4">
				<div className="flex-1 overflow-y-auto space-y-4 pr-2">
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${
								msg.role === "user" ? "justify-end" : "justify-start"
							}`}>
							<div
								className={`max-w-[78%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
									msg.role === "user"
										? "bg-primary text-primary-foreground rounded-br-none"
										: "bg-green-100 text-green-800 rounded-bl-none border border-border/30"
								}`}>
								<p className="whitespace-pre-line">{msg.content}</p>
								<span className="text-xs opacity-60 mt-2 block text-right">
									{msg.timestamp.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					))}

					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-secondary/80 text-secondary-foreground px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm border border-border/30">
								<Loader2 size={16} className="animate-spin text-primary" />
								<span className="text-sm">Thinking...</span>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				<div className="flex gap-3 pt-4 border-t border-border/30 mt-4">
					<input
						placeholder="Type your message..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
						disabled={isLoading}
						className="flex-1 px-4 py-2 bg-input border border-border/50 rounded-full"
					/>
					<button
						onClick={handleSendMessage}
						disabled={isLoading || !input.trim()}
						className="bg-primary hover:bg-accent text-primary-foreground rounded-full shadow-md w-10 h-10 flex items-center justify-center"
						aria-label="Send message">
						<Send size={18} />
					</button>
				</div>
			</div>
		</div>
	);
}
