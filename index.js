import express from "express";
import dotenv from "dotenv";
import swagger from "swagger-ui-express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { productRouter } from "./src/features/product/product.router.js";
import userRouter from "./src/features/user/user.router.js";
import { jwtAuth } from "./src/middleware/jwtToken.js";
import { cartRouter } from "./src/features/cart/cart.router.js";
import { likeRouter } from "./src/features/like/like.router.js";
import fs from "fs";
import cors from "cors";
import {
  loggerMiddleware,
  errorLoggerMiddleware,
} from "./src/middleware/logger.middleware.js";
import ApplicationError from "./errorHandling.js";
//import { connectDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.router.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
const apiDoc = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));
//import apiDoc from './swagger.json' assert {type:'json'}
const app = express();
app.use(cookieParser());
//laod all environment variables
dotenv.config();
//setting up cors middleware
const corsOptions = {
  origin: "localhost://5000,loaclhost://5500",
};
app.use(cors(corsOptions));
app.use(express.json());

//API Documentation (Swagger 3.0)
app.use("/api-doc", swagger.serve, swagger.setup(apiDoc));
//Middleware function to log the data
//app.use(loggerMiddleware);

app.use("/api/user", userRouter);
app.use("/api/products", jwtAuth, productRouter);
app.use("/api/like", jwtAuth, likeRouter);
app.use("/api/cart", jwtAuth, cartRouter);
app.use("/api/orders", jwtAuth, orderRouter);
//Default request
app.get("/", (req, res) => {
  res.send("Welcome to E-Comm API...");
});
//Middleware to handle 404 requests

app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  } else {
    errorLoggerMiddleware(err, req, res, next);
    console.log(err);
    res.status(500).send("Something went wrong please try again!!");
  }
});

app.use((req, res) => {
  res.status(404).send("API not found.");
});

app.listen(5000, () => {
  console.log("server is up on port 5000");
  connectUsingMongoose();
});
