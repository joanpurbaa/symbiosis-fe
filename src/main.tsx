import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));

const router = createBrowserRouter([
	{
		path: "/masuk",
		element: <Login onLogin={() => {}} />,
	},
	{
		path: "/admin/dashboard",
		element: <Admin />,
	},
	{
		path: "/admin/documents",
		element: <Admin />,
	},
	{
		path: "/admin/sroi-calculator",
		element: <Admin />,
	},
	{
		path: "/admin/user-management",
		element: <Admin />,
	},
	{
		path: "/admin/profile",
		element: <Admin />,
	},
	{
		path: "*",
		element: <Login onLogin={() => {}} />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />
);
