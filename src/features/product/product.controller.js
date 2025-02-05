import ProductModel from "./product.model.js";

export default class ProductController{

    getAllProducts=(req,res)=>{
        const products=ProductModel.getAll();
            res.status(200).send(products);
    }

    addProduct=(req,res)=>{
        const {name,desc,price,catagory,sizes}=req.body;
        const newProduct={
            name,
            desc,
            price:parseFloat(price),
            imgUrl:req.file.filename,
            catagory,
            sizes:sizes.split(',')
        }
        const createRecord=ProductModel.add(newProduct);
        res.status(201).send(createRecord);
    }

    getOne=(req,res)=>{
        const id=req.params.id;
        const product=ProductModel.get(id);
        if(!product){
            res.status(404).send("Product Not Found!")
        }
        else{
            res.status(200).send(product)
        }
        
    }

    getFilter=(req,res)=>{
        const min=req.query.min;
        const max=req.query.max;
        const result=ProductModel.filter(min,max);      
        res.status(200).send(result);
    }

    postRatings=(req,res)=>{
        const{userID,productId,ratings}=req.query;
        
        const error=ProductModel.ratings(userID,productId,ratings);        
        if(error){            
            return res.status(400).send(error.message)
        }
        res.status(200).send("Thanks for rating.")
    }
} 