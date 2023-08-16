import Express from "express";
import {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
} from "../controller/authenticationController.js";
import {
  isAdmin,
  requireSignIn,
} from "../middleware/authenticationMiddleware.js";
//router object
const router = Express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//FORGET PASSWORD
router.post("/forget-password", forgetPasswordController);

//TEST ROUTES
router.get("/test", requireSignIn, isAdmin, testController);

//PROTECTED ROUTES
router.get("/user-auth", requireSignIn, (request, response) => {
  response.status(200).send({ ok: true });
});

export default router;
