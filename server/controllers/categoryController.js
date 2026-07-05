import Category from '../models/Category.js';
import { sendResponse, sendError } from '../utils/helpers.js';

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    sendResponse(res, 200, true, 'Categories fetched successfully', categories);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    sendResponse(res, 200, true, 'Category fetched successfully', category);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image, icon } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return sendError(res, 400, 'Category already exists');
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const category = await Category.create({
      name,
      description,
      image,
      icon,
      slug,
    });

    sendResponse(res, 201, true, 'Category created successfully', category);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    sendResponse(res, 200, true, 'Category updated successfully', category);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    sendResponse(res, 200, true, 'Category deleted successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
