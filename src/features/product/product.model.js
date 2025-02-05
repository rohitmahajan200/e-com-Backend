import { users } from "../user/user.model.js";
export default class ProductModel{
    constructor(id,name,desc,price,imgUrl,catagory,sizes){
        this.id=id,
        this.name=name,
        this.desc=desc,
        this.price=price,
        this.imgUrl=imgUrl,
        this.catagory=catagory,
        this.sizes=sizes
    }

    static add(product){
        product.id=products.length+1;
        products.push(product);
        return product;
    }

    static getAll(){
        return products
    }

    static get(id){
        const item=products.find((p)=>p.id==id);
        return item;
    }

    static filter(min,max){
        const items=products.filter((p)=>{
            return(
                p.price>=min && p.price<=max
            )
        });
        return items;
    }

    static ratings(userId,productId,ratings){
        //checking if user register or not
        const user=users.find((u)=>userId==u.email);
        if(user){
            const product=products.find((p)=>productId==p.id);
            console.log("product in model ",product);
            
            if(product){
                //check if there are any rating if not then add ratings array
                if(!product.ratings){
                    product.ratings=[];
                    product.ratings.push({ratings:ratings,userId:userId})
                }
                else{
                    //find existing rating of specfic customer using user id
                    const existingRating=product.ratings.findIndex((rating)=>rating.userId==userId);
                    //update the existing ratings is rating already exist
                    if(existingRating>=0){
                        product.ratings[existingRating]={
                            ratings:ratings,userId:userId
                        }
                    }
                    else{
                    //if no rating exist add new ratings
                    product.ratings.push({ratings:ratings,userId:userId})
                    }
                }
            }
            else{
                const err=new Error("product not found");
                return err;
            }
        }
        else{
            const err=new Error("user not found");
            return err;
        }
    
    }


}
let products=[
    new ProductModel(
        1,
        'black t-shirt',
        'black round neck tshirt',
        300,
        'https://n-img2.junaroad.com/uiproducts/18054115/zoom_0-1635586665.jpg',
        't-shirts',
        ['M','L','XL','XXL']
    ),

    new ProductModel(
        2,
        'white shirt',
        'white formal shirt',
        500,
        'https://ramrajcotton.in/cdn/shop/files/1_edbda5bc-31cb-45ba-bb8e-15ba00ae1205.jpg?v=1719656319&width=1080',
        'shirts',
        ['M','L','XL']
    )
]
