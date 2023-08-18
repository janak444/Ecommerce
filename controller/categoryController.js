import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import { request, response } from "express";

export const createCategoryController = async (request, response) => {
  try {
    const { name } = request.body;
    if (!name) {
      return response.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return response.status(200).send({
        success: true,
        message: "This Category already exists",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    response.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};

export const updateCategoryController = async (request, response) => {
  try {
    const { name } = request.body;
    const { id } = request.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    response.status(200).send({
      success: true,
      message: "Category update successful",
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in updating the category",
    });
  }
};

//get all category
export const categoryControlller = async (request, response) => {
  try {
    const category = await categoryModel.find({});
    response.status(200).send({
      success: true,
      message: "All category list",
      category,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in getting categories",
    });
  }
};

//single Category controller
export const singleCategoryController = async (request, response) => {
  try {
    const category = await categoryModel.findOne({ slug: request.params.slug });
    response.status(200).send({
      success: true,
      message: "Get single category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in single Category",
    });
  }
};

//delete category
export const deleteCategoryController = async (request, response) => {
  try {
    const { id } = request.params;
    await categoryModel.findByIdAndDelete(id);
    response.status(200).send({
      success: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    error,
      response.status(500).send({
        success: false,
        message: "getting error while deleting the category",
      });
  }
};
