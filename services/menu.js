import Product from "../models/product.js";
import { v4 as uuid } from "uuid";

export async function getMenu() {
  try {
    console.log("Fetching menu from database...");
    const menu = await Product.find();
    console.log(menu);
    return menu;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getProduct(prodId) {
  try {
    const product = await Product.findOne({ prodId: prodId });
    return product;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function createProduct(productData) {
  try {
    const newProduct = {
      prodId: `prod-${uuid().substring(0, 8)}`,
      title: productData.title,
      desc: productData.desc,
      price: productData.price,
      createdAt: new Date(),
    };

    const result = await Product.create(newProduct);
    return result;
  } catch (error) {
    console.log("Error creating product:", error.message);
    return null;
  }
}

export async function updateProduct(prodId, updateData) {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { prodId: prodId },
      {
        ...updateData,
        modifiedAt: new Date(),
      },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    console.log("Error updating product:", error.message);
    return null;
  }
}

export async function deleteProduct(prodId) {
  try {
    const result = await Product.deleteOne({ prodId: prodId });
    if (result.deletedCount === 0) {
      return {
        success: false,
        message: `Didn't found a product with prodId: ${prodId}`,
      };
    }

    return {
      success: true,
      message: `Product with prodId: ${prodId} deleted correctly.`,
    };
  } catch (error) {
    console.log("Error deleting product:", error.message);
    return {
      success: false,
      message: `Error deleting product: ${error.message}`,
    };
  }
}
