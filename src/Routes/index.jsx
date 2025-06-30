import { createBrowserRouter } from "react-router-dom";
import Login from "../Pages/login";
import Dashboard from "../Pages/Dashboard";
import Template from "../Layouts/Template";

export const router = createBrowserRouter([
    {
         path: '/',
        element: <Template />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
        ]
    }
])