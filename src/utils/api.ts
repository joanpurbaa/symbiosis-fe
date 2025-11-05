const API_BASE_URL = "http://localhost:8000/api";

export const api = {
	async request(endpoint: string, options: RequestInit = {}) {
		const token = localStorage.getItem("access_token");

		const config: RequestInit = {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

			if (response.status === 401) {
				localStorage.removeItem("access_token");
				localStorage.removeItem("currentUser");
				window.location.href = "/masuk";
				return null;
			}

			return response;
		} catch (error) {
			console.error("API request error:", error);
			throw error;
		}
	},

	async get(endpoint: string) {
		const response = await this.request(endpoint);
		if (!response) return null;
		return response.json();
	},

	async post(endpoint: string, data: any) {
		const response = await this.request(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
		if (!response) return null;
		return response.json();
	},

	async put(endpoint: string, data: any) {
		const response = await this.request(endpoint, {
			method: "PUT",
			body: JSON.stringify(data),
		});
		if (!response) return null;
		return response.json();
	},

	async delete(endpoint: string) {
		const response = await this.request(endpoint, {
			method: "DELETE",
		});
		if (!response) return null;
		return response.json();
	},
};

export const logout = async () => {
	try {
		const token = localStorage.getItem("access_token");
		if (token) {
			await fetch(`${API_BASE_URL}/logout`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		}
	} catch (error) {
		console.error("Logout error:", error);
	} finally {
		localStorage.removeItem("access_token");
		localStorage.removeItem("currentUser");
		window.location.href = "/masuk";
	}
};
