import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    ADD product
// @route   POST /api/products
// @access  private admin
const addProduct = asyncHandler(async (req, res) => {
  const reqNewProduct = await req.body;

  const product = new Product({
    user: req.user._id,
    name: reqNewProduct.name,
    image: reqNewProduct.name,
    description: reqNewProduct.description,
    brand: reqNewProduct.brand,
    category: reqNewProduct.category,
    price: reqNewProduct.price,
    countInStock: reqNewProduct.countInStock,
    rating: reqNewProduct.rating,
    numReviews: reqNewProduct.numReviews,
  });

  const newProduct = await product.save();

  res.status(201).json(newProduct);
});

// @desc    Edit single product
// @route   PUT /api/products/:id
// @access  private admin
const updateProduct = asyncHandler(async (req, res) => {
  const reqUpdateProduct = await req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product._id = reqUpdateProduct._id || product._id;
    product.name = reqUpdateProduct.name || product.name;
    product.image = reqUpdateProduct.image || product.image;
    product.description = reqUpdateProduct.description || product.description;
    product.brand = reqUpdateProduct.brand || product.brand;
    product.category = reqUpdateProduct.category || product.category;
    product.price = reqUpdateProduct.price || product.price;
    product.countInStock =
      reqUpdateProduct.countInStock || product.countInStock;
    product.rating = reqUpdateProduct.rating || product.rating;
    product.numReviews = reqUpdateProduct.numReviews || product.numReviews;

    await product.save();

    res.json("Product updated successfully!");
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete single product by Admin
// @route   DELETE /api/products/:id
// @access  Private Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.remove();
    res.json({ message: "Product removed successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  addProduct,
};
