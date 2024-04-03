import { createBrowserRouter, RouteObject, Navigate } from "react-router-dom";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import HomePage from "../Pages/Home/Home";
import EditProducts from "../Pages/EditProduct/EditProduct";
import AddProduct from "../Pages/AddProducts/AddProduct";
import ViewProductsList from "../Pages/ViewProducts/ViewProductsList";
import RequireAuthGuard from "./RequireAuthGuard";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to="/login" replace />,
        errorElement: <Error />,
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <Error />
    },
    {
        path: '/home',
        element: <RequireAuthGuard><HomePage /></RequireAuthGuard>,
    },
    { path: '/view-products', element: <RequireAuthGuard><ViewProductsList /></RequireAuthGuard> },
            { path: '/edit-products', element: <RequireAuthGuard><EditProducts /></RequireAuthGuard> },
            { path: '/edit-product/:id', element: <RequireAuthGuard><EditProducts /></RequireAuthGuard> },
            { path: '/add-product', element: <RequireAuthGuard><AddProduct /></RequireAuthGuard> },
    // ... potentially other admin routes
];

export const router = createBrowserRouter(routes);


// Define the router's route structure with TypeScript typing
