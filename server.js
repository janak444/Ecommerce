import express, { Router } from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authenticationRoutes from "./routes/authenticationRoutes.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

//configure env
dotenv.config();

//rest object
const app = express();

//middleware
// app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

//database config
connectDB();

//routes
app.use("/api/v1/auth", authenticationRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);

//rest api
app.get("/", (request, response) => {
  response.send({
    message: "welcome to customer app",
  });
});

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`.bgCyan.white);
});
