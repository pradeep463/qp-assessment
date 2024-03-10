import { Request, Response } from "express";
import { test } from "../controllers/testController";
import { getListProducts } from "../controllers/v1/User/ProductListController";
import {
  addProducts,
  deleteProduct,
  getProducts,
  manageInventory,
  updateProducts,
} from "../controllers/v1/Admin/Products/ProductController";
import { addToCart } from '../controllers/v1/User/CartController';
import { placeOrder } from '../controllers/v1/User/OrderController';


interface Route {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  isFileUpload: boolean;
  handler: (req: Request, res: Response) => void;
}
export const allRoutes: Route[] = [
  { method: "GET", isFileUpload: false, path: "/", handler: test },
  {
    method: "POST",
    isFileUpload: true,
    path: "/add-product",
    handler: addProducts,
  },
  {
    method: "POST",
    isFileUpload: true,
    path: "/update-product",
    handler: updateProducts,
  },
  {
    method: "GET",
    isFileUpload: false,
    path: "/get-all-product",
    handler: getProducts,
  },
  {
    method: "DELETE",
    isFileUpload: false,
    path: "/delete-product",
    handler: deleteProduct,
  },
  {
    method: "PUT",
    isFileUpload: false,
    path: "/manage-inventory",
    handler: manageInventory,
  },
  {
    method: "GET",
    isFileUpload: false,
    path: "/list-products",
    handler: getListProducts,
  },
  {
    method: "POST",
    isFileUpload: false,
    path: "/add-to-cart",
    handler: addToCart,
  },
  {
    method: "POST",
    isFileUpload: false,
    path: "/place-order",
    handler: placeOrder,
  },
];
