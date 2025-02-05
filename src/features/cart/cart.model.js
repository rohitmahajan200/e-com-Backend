export default class CartModel{
    constructor(id,productId,quantity,userId){
        this.id=id;
        this.productId=Number(productId),
        this.quantity=Number(quantity)
        this.userId=userId
    }

    static add(productId,quantity,userId){
        const ifItemExist=cartItems.find((item)=>item.productId==productId && item.userId==userId);
        if(ifItemExist){
            const updateQuantity=ifItemExist.quantity+Number(quantity);
            ifItemExist.quantity=updateQuantity
            return ifItemExist;
        }
        else{
        const id=cartItems.length+1;
        const newItem=new CartModel(id,productId,quantity,userId);
        cartItems.push(newItem);
        return newItem;
        }
    
    }

    static delete(cartId,userId){
        const ifItemExist=cartItems.findIndex((item)=>item.id==cartId && item.userId==userId);
        if(ifItemExist>=0){
            const itemRemoved=cartItems[ifItemExist]
            cartItems.splice(ifItemExist,1);
            return itemRemoved;
        }
        else{
            return "Product not found"
        }

    }

    static getAll(userId){
        const userCart=cartItems.filter((item)=>item.userId==userId);
        console.log(userCart);
        
        return userCart;
    }

}

const cartItems=[
    new CartModel(1,2,1),
    new CartModel(3,1,2)
]