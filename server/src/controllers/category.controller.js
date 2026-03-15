import { validationResult } from "express-validator";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

///////////////// Get All Categories ////////////////////

export const getCategories = async (req, res) => {
  try {
    const { search } = req.query;

    const matchStage = {};
    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.aggregate([
      { $match: matchStage },

      // Join with products collection
      {
        $lookup: {
          from: "products", // MongoDB collection name (important: lowercase plural)
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        },
      },

      // Add product count
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },

      // Remove products array (we only need count)
      {
        $project: {
          products: 0,
        },
      },

      { $sort: { name: 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

///////////////// Get a Category By Id ////////////////////
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    res.status(200).json({ category: category, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

///////////////// Create a Category ////////////////////
export const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }

    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res
        .status(400)
        .json({ message: "Category name already exists", success: false });
    }

    // Slug is automatically handled by the pre-save hook in your model
    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: category,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

///////////////// Update Category By Id ////////////////////
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    const { name, description } = req.body;

    if (name) category.name = name;
    if (description) category.description = description;

    // Using .save() triggers the 'pre-save' hook to regenerate the slug if name changes
    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

///////////////// Delete a Category By Id ////////////////////
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
