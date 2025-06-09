import Product from "../models/product.js";

export async function getMenu() {
  try {
    const menu = await Product.find();
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
    return result;
  } catch (error) {
    console.log("Error deleting product:", error.message);
    return null;
  }
}
