import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middleware/file.upload.middleware.js";
const productController = new ProductController();

export const productRouter = express.Router();

productRouter.get("/all", (req, res) => {
  productController.getAllProducts(req, res);
});

productRouter.post("/",upload.single("imgUrl"),(req, res) => {
   productController.addProduct(req, res);
});

productRouter.get("/", (req, res) => {
    productController.getOne(req, res);
  });
  
productRouter.get("/filter", (req, res) => {
    productController.getFilter(req, res);
});

productRouter.get("/averagePrice",(req,res)=>{
  productController.averagePrice(req,res)
});

productRouter.get("/averageRating",(req,res)=>{
  productController.averageRating(req,res)
});

productRouter.post("/ratings", (req, res) => {
    productController.postRatings(req, res);
});




