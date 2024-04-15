import { createBrowserRouter, RouteObject, Navigate } from "react-router-dom";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import HomePage from "../Pages/Home/Home";
import EditProducts from "../Pages/EditProduct/EditProduct";
import AddProduct from "../Pages/AddProducts/AddProduct";
import ViewProductsList from "../Pages/ViewProducts/ViewProductsList";
import RequireAuthGuard from "./RequireAuthGuard";
import Layout from "../Root/Layout/Layout";
import UpdateStockContainer from "../Pages/UpdateStockContainer/UpdateStockContainer";
import ConsultStockContainer from '../Pages/ConsultStockContainer/ConsultStockContainer'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />, // Your Layout component with NavBar and Outlet
    errorElement: <Error />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'home', element: <RequireAuthGuard><HomePage /></RequireAuthGuard> },
      { path: 'view-products', element: <RequireAuthGuard><ViewProductsList /></RequireAuthGuard> },
      { path: 'edit-products', element: <RequireAuthGuard><EditProducts /></RequireAuthGuard> },
      { path: 'edit-product/:id', element: <RequireAuthGuard><EditProducts /></RequireAuthGuard> },
      { path: 'add-product', element: <RequireAuthGuard><AddProduct /></RequireAuthGuard> },
      { path: 'stock-update', element: <RequireAuthGuard><UpdateStockContainer/></RequireAuthGuard>, },
      { path: 'stock-consult', element: <RequireAuthGuard><ConsultStockContainer/></RequireAuthGuard>, },
      
      // ... potentially other protected routes
    ],
  },
  // Other routes that should not be inside the Layout can still go here
  // For example, if you have routes that should not display the NavBar, like a full-screen login page
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />
  },
];

export const router = createBrowserRouter(routes);
