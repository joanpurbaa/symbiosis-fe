import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));

const LoadingSpinner = () => (
	<div className="min-h-screen flex items-center justify-center bg-gray-100">
		<div className="text-center">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
			<p className="mt-4 text-gray-600">Loading...</p>
		</div>
	</div>
);

const router = createBrowserRouter([
	{
		path: "/masuk",
		element: (
			<Suspense fallback={<LoadingSpinner />}>
				<Login />
			</Suspense>
		),
	},
	{
		path: "/admin/dashboard",
		element: (
			<Suspense fallback={<LoadingSpinner />}>
				<ProtectedRoute>
					<Admin />
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: "/admin/documents",
		element: (
			<Suspense fallback={<LoadingSpinner />}>
				<ProtectedRoute>
					<Admin />
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: "/admin/sroi-calculator",
		element: (
			<Suspense fallback={<LoadingSpinner />}>
				<ProtectedRoute>
					<Admin />
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: "/admin/user-management",
		element: (
			<Suspense fallback={<LoadingSpinner />}>
				<ProtectedRoute allowedRoles={["admin"]}>
					<Admin />
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: "/admin/profile",
		element: (
			<Suspense fallback={<LoadingSpinner />}>
				<ProtectedRoute allowedRoles={["user"]}>
					<Admin />
				</ProtectedRoute>
			</Suspense>
		),
	},
	{
		path: "/",
		element: <Navigate to="/admin/dashboard" replace />,
	},
	{
		path: "*",
		element: <Navigate to="/masuk" replace />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />
);
