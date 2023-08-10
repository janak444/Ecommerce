import express, { Router } from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authenticationRoutes from "./routes/authenticationRoutes.js";
import cors from "cors";

//configure env
dotenv.config();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));

//database config
connectDB();

//routes
app.use("/api/v1/auth", authenticationRoutes);

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
