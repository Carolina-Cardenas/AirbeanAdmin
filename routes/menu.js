import { Router } from "express";

import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  getMenu,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/menu.js";

const router = Router();

router.get("/", async (req, res, next) => {
  console.log("Fetching menu...");
  const menu = await getMenu();
  if (menu) {
    res.json({
      success: true,
      menu: menu,
    });
  } else {
    next({
      status: 404,
      message: "Menu not found",
    });
  }
});

router.post("/", verifyToken, isAdmin, async (req, res, next) => {
  console.log("Creating new product...");

  const product = await createProduct(req.body);

  if (product) {
    res.json({
      success: true,
      message: "Product created successfully",
      product: product,
    });
  } else {
    next({
      status: 400,
      message: "Failed to create product",
    });
  }
});

router.put("/:prodId", verifyToken, isAdmin, async (req, res, next) => {
  const { prodId } = req.params;
  const products = await updateProduct(prodId, req.body);
  if (products) {
    res.json({
      success: true,
      message: "Product updated successfully",
      product: products,
    });
  } else {
    next({
      status: 404,
      message: `Product with prodId ${prodId} not found`,
    });
  }
});

router.delete("/:prodId", verifyToken, isAdmin, async (req, res, next) => {
  const { prodId } = req.params;
  const deleted = await deleteProduct(prodId);
  console.log(`Deleting product with prodId: ${prodId}`);
  console.log(`Deleted: ${deleted}`);
  if (deleted.success) {
    res.json({
      success: true,
      message: `Product with prodId ${prodId} deleted successfully`,
    });
  } else {
    next({
      status: 404,
      message: `Product with prodId ${prodId} not found`,
    });
  }
});

export default router;
