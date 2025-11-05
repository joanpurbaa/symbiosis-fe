import type { ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
	children: ReactNode;
	allowedRoles?: string[];
}

export default function ProtectedRoute({
	children,
	allowedRoles,
}: ProtectedRouteProps) {
	const currentUser = localStorage.getItem("currentUser");
	const accessToken = localStorage.getItem("access_token");

	if (!currentUser || !accessToken) {
		return <Navigate to="/masuk" replace />;
	}

	try {
		const user = JSON.parse(currentUser);

		if (allowedRoles && allowedRoles.length > 0) {
			if (!allowedRoles.includes(user.role)) {
				return <Navigate to="/admin/dashboard" replace />;
			}
		}

		return <>{children}</>;
	} catch {
		localStorage.removeItem("currentUser");
		localStorage.removeItem("access_token");
		return <Navigate to="/masuk" replace />;
	}
}
