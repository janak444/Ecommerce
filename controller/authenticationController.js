import {
  comparePassword,
  hashPassword,
} from "../helpers/authenticationHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (request, response) => {
  try {
    const { name, email, password, phone, address, answer } = request.body;
    //validations
    if (!name) {
      return response.send({ message: "Name is required" });
    }
    if (!email) {
      return response.send({ message: "Email is required" });
    }
    if (!password) {
      return response.send({ message: "Password is required" });
    }
    if (!phone) {
      return response.send({ message: "Phone number is required" });
    }
    if (!address) {
      return response.send({ message: "Address is required" });
    }
    if (!answer) {
      return response.send("Please enter your answer of security question");
    }

    //check user
    const existingUser = await userModel.findOne({ email });

    //existing User
    if (existingUser) {
      return response.status(200).send({
        success: true,
        message: "Already Register please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    response.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (request, response) => {
  try {
    const { email, password } = request.body;

    //validation
    if (!email || !password) {
      return response.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return response.status(404).send({
        success: false,
        message: "Email is not register",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return response.status(200).send({
        success: false,
        message: "invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    response.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forget password controller
export const forgetPasswordController = async (request, response) => {
  try {
    const { email, answer, newPassword } = request.body;
    if (!email) {
      response.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      response.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      response.status(400).send({ message: "New password is required" });
    }
    // check for the existing of this email
    const user = await userModel.findOne({ email, answer });
    //Validation
    if (!user) {
      return response.status(404).send({
        success: false,
        message: "User not found with that email address.",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    response.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

//test controller
export const testController = (request, response) => {
  response.send("protected route");
};
