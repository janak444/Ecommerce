import { send } from "process";
import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import { response } from "express";

export const createProductController = async (request, response) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      request.fields;
    const { photo } = request.files;
    //validation
    switch (true) {
      case !name:
        return response.status(500).send({ error: "Name is required" });
      case !description:
        return response.status(500).send({ error: "description is required" });
      case !price:
        return response.status(500).send({ error: "Price is required" });
      case !category:
        return response.status(500).send({ error: "Category is required" });
      case !quantity:
        return response.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 1000000:
        return (
          response.status(500),
          send({ error: "Photo is required and should be less then 1 MB" })
        );
    }
    const products = await productModel({
      ...request.fields,
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    response.status(201).send({
      success: true,
      message: "product created successfully",
      CountTotal: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getProductController = async (request, response) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    return response.status(200).send({
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in getting Product",
    });
  }
};

export const getSingleProductController = async (request, response) => {
  try {
    const product = await productModel
      .findOne({ slug: request.params.slug })
      .select("-photo")
      .populate("category");

    response.status(200).send({
      success: true,
      message: "single product fetch",
      product,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in Getting Single Product",
    });
  }
};

export const productPhotoController = async (request, response) => {
  try {
    const product = await productModel
      .findById(request.params.pid)
      .select("photo");
    if (product.photo.data) {
      response.set("content-type", product.photo.contentType);
      return response.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    response.status(5000).send({
      success: false,
      error,
      message: "Error while uploading photos",
    });
  }
};

export const deleteController = async () => {
  try {
    await productModel.findByIdAndDelete(request.params.pid).select("-photo");
    response.status(200).send({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      error,
      message: "Error While Deleting",
    });
  }
};

export const updateProductController = async (request, response) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      request.fields;
    const { photo } = request.files;
    //validation
    switch (true) {
      case !name:
        return response.status(500).send({ error: "Name is required" });
      case !description:
        return response.status(500).send({ error: "description is required" });
      case !price:
        return response.status(500).send({ error: "Price is required" });
      case !category:
        return response.status(500).send({ error: "Category is required" });
      case !quantity:
        return response.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 1000000:
        return (
          response.status(500),
          send({ error: "Photo is required and should be less then 1 MB" })
        );
    }
    const products = await productModel.findByIdAndUpdate(request.params.pid, {
      ...request.fields,
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    response.status(201).send({
      success: true,
      message: "product updated successfully",
      CountTotal: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      error,
      message: "Error In Updating the product",
    });
  }
};
