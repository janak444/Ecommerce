import Express from "express";
import {
  isAdmin,
  requireSignIn,
} from "../middleware/authenticationMiddleware.js";
import {
  createProductController,
  deleteController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
} from "../controller/productController.js";
import formidable from "express-formidable";

const router = Express.Router();

//create product route
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable({}),
  createProductController
);

//update product route
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable({}),
  updateProductController
);

//get products route
router.get("/get-product", getProductController);

//single products route
router.get("/get-product/:slug", getSingleProductController);

//get photo route
router.get("/product-photo/:pid", productPhotoController);

//delete product route
router.delete("/products", deleteController);

export default router;
