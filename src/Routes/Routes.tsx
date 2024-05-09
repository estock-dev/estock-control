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
import StrangeloveContainer from "../Pages/ContentContainers/StrangeloveContainer";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />, 
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: '/', 
    element: <RequireAuthGuard><MainLayout /></RequireAuthGuard>,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'edit-products', element: <EditProducts /> },
      { path: 'edit-product/:id', element: <EditProducts /> },
      { path: 'manage-stock', element: <StockManagementContainer /> },
      { path: 'add-product', element: <AddProductContainer /> },
      { path: 'stock-update', element: <UpdateStockContainer /> },
      { path: 'list-export', element: <ExportlistContainer /> },
      { path: 'strangelove', element: <StrangeloveContainer/> },
    ],
    errorElement: <Error />
  }
];

export const router = createBrowserRouter(routes);
