import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  getAllProducts = async (req, res) => {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send("Something went wrong with get all");
    }
  };

  addProduct = async (req, res) => {
    try {
      const { name, desc, price, catagory, sizes } = req.body;
      console.log("file-->",req.file);
      
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        req.file.filename,
        catagory,
        sizes.split(",")
      );
      await this.productRepository.add(newProduct);
      res.status(201).send(newProduct);
    } catch (error) {
      console.log(error);
      
      res.status(500).send("Something went wrong with add");
    }
  };

  getOne = async (req, res) => {
    try {
        const id = req.query.id;
        const product = await this.productRepository.get(id);
        if (!product) {
          res.status(404).send("Product Not Found!");
        } else {
          res.status(200).send(product);
        }  
    } catch (error) {
        console.log(error);
        
        res.status(500).send("Something went wrong with get one");
    } 

  };

  getFilter = async (req, res) => {
    try {
        const min = req.query.min;
        const max = req.query.max;
        const catagories=req.query.catagories;
        
    
        const result = await this.productRepository.filter(min,max,catagories);
        if(result){
            res.status(200).send(result);
        }
        else{
            res.status(404).send("No match found")
        }
             
    } catch (error) {
      console.log(error);
      
        res.status(500).send("Something went wrong with filter");
    }

  };

  postRatings = async(req, res) => {
    try {
    const userId=req.userId;
    const { productId, ratings } = req.body;
    await this.productRepository.rate(userId, productId, ratings);
    res.status(200).send("Thanks for rating.");
    } catch (error) {
      console.log(error);
        res.status(500).send("something went wrong for ratings")
    }
  };

  averagePrice=async(req,res)=>{
    try {
      const result=await this.productRepository.average_Price_Per_Catagory();
      res.status(200).send(result)
    } catch (error) {
      res.status(500).send("Something went wrong with average price");
    }
  }

  averageRating=async(req,res)=>{
    try {
      const result=await this.productRepository.average_Rating();
      res.status(200).send(result)
    } catch (error) {
      console.log(error);
      
      res.status(500).send("Something went wrong with average ratings");
    }
  }
}
