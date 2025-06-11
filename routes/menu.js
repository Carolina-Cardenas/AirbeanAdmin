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

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Skapa en ny produkt
 *     description: Endast tillgänglig för admin-användare. Kräver giltig JWT-token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prodId
 *               - title
 *               - desc
 *               - price
 *             properties:
 *               prodId:
 *                 type: string
 *                 example: prod-mocha
 *               title:
 *                 type: string
 *                 example: Mocha Delight
 *               desc:
 *                 type: string
 *                 example: En fyllig blandning av choklad och kaffe.
 *               price:
 *                 type: number
 *                 example: 62
 *     responses:
 *       200:
 *         description: Produkten skapades
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Product created successfully
 *               product:
 *                 prodId: prod-mocha
 *                 title: Mocha Delight
 *                 desc: En fyllig blandning av choklad och kaffe.
 *                 price: 62
 *       400:
 *         description: Ogiltig data eller misslyckades att skapa produkt
 *       401:
 *         description: Ingen token angavs
 *       403:
 *         description: Endast admins har tillgång
 */
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

/**
 * @swagger
 * /api/menu/{prodId}:
 *   put:
 *     summary: Uppdatera en produkt
 *     description: Endast tillgänglig för användare med admin-roll. Kräver JWT-token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         description: ID för produkten som ska uppdateras
 *         schema:
 *           type: string
 *           example: prod-tofth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Kaffe Latte Deluxe
 *               desc:
 *                 type: string
 *                 example: Bryggd på månadens lyxbönor.
 *               price:
 *                 type: number
 *                 example: 59
 *     responses:
 *       200:
 *         description: Produkten uppdaterades
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Product updated successfully
 *               product:
 *                 prodId: prod-tofth
 *                 title: Kaffe Latte Deluxe
 *                 desc: Bryggd på månadens lyxbönor.
 *                 price: 59
 *       401:
 *         description: Ingen token angavs eller ogiltig token
 *       403:
 *         description: Endast admins har tillgång
 *       404:
 *         description: Produkten hittades inte
 */

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

/**
 * @swagger
 * /api/menu/{prodId}:
 *   delete:
 *     summary: Radera en produkt (admin endast)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prodId
 *         required: true
 *         schema:
 *           type: string
 *         description: Produktens ID
 *     responses:
 *       200:
 *         description: Produkten raderades
 *       401:
 *         description: Token saknas eller ogiltig
 *       403:
 *         description: Saknar adminbehörighet
 *       404:
 *         description: Produkten hittades inte
 */
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
