import { createBrowserRouter, RouteObject, Navigate } from "react-router-dom";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import HomePage from "../Pages/Home/Home";
import EditProducts from "../Pages/EditProduct/EditProduct";
import AddProduct from "../Pages/AddProducts/AddProduct";
import ViewProductsList from "../Pages/ViewProducts/ViewProductsList";

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
        element: <HomePage />,
    },
    { path: '/view-products', element: <ViewProductsList /> },
            { path: '/edit-products', element: <EditProducts /> },
            { path: '/edit-product/:id', element: <EditProducts /> },
            { path: '/add-product', element: <AddProduct /> },
    // ... potentially other admin routes
];

export const router = createBrowserRouter(routes);


// Define the router's route structure with TypeScript typing
