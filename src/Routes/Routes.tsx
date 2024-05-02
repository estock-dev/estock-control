import { createBrowserRouter, RouteObject, Navigate } from "react-router-dom";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import EditProducts from "../Pages/EditProduct/EditProduct";
import RequireAuthGuard from "./RequireAuthGuard";
import MainLayout from "../Root/MainLayout/MainLayout";
import AddProductContainer from "../Pages/ContentContainers/AddProductContainer";
import StockManagementContainer from "../Pages/ContentContainers/StockManagementContainer";
import UpdateStockContainer from "../Pages/ContentContainers/UpdateStockContainer";
import ExportlistContainer from "../Pages/ContentContainers/ExportListContainer";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'home', element: <RequireAuthGuard><Home /></RequireAuthGuard> },
      { path: 'edit-products', element: <RequireAuthGuard><EditProducts /></RequireAuthGuard> },
      { path: 'edit-product/:id', element: <RequireAuthGuard><EditProducts /></RequireAuthGuard> },
      { path: 'manage-stock', element: <RequireAuthGuard><StockManagementContainer /></RequireAuthGuard> },
      { path: 'add-product', element: <RequireAuthGuard><AddProductContainer /></RequireAuthGuard> },
      { path: 'stock-update', element: <RequireAuthGuard><UpdateStockContainer /></RequireAuthGuard>, },
      { path: 'list-export', element: <RequireAuthGuard><ExportlistContainer /></RequireAuthGuard>, },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />
  },
];

export const router = createBrowserRouter(routes);
