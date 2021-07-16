const jwt = require('jsonwebtoken');
const db = require('../database');
const Op = db.DataType.Op;

const Cart = db.cart;
const Wishlish = db.wishlish;

exports.addItem = async (req, res) => {
    
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;

    const _quantity = req.body.newQuantity;
    const newTotal = _quantity*req.body.product.price;
    const _productId = req.body.product.id;

    const cart = {
        productId: _productId,
        userId:_userId,
        total:newTotal,
        quantity:_quantity
    }
    


    Cart.findOne({where:{[Op.and]: [
            {userId: {[Op.like]: _userId} , productId: {[Op.like]: _productId}}]
        }})
    .then((cartItem)=>{

        Wishlish.findOne({where:{[Op.and]: [
                {userId: {[Op.like]: _userId} , productId: {[Op.like]: _productId}}]
            }})
        .then((wishItem)=>{
            if(wishItem!==null){
                Wishlish.destroy({where: {id : wishItem.id}});
            }
        })

        if(cartItem!==null){
            let quantity = parseInt(cartItem.quantity) + parseInt(_quantity);

            Cart.update({quantity:quantity,
                total:cartItem.total+newTotal}, {where: { id: cartItem.id }})
            .then(()=>{
                return res.send({ message: "Added To Cart" });
            })
        }
        else{
            Cart.create(cart)
            .then(()=>{
                return res.send({ message: "Added To Cart" });
            })
        }
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    });

};

exports.updateQuantity = async (req, res) => {
    
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;

    const _quantity = req.body.newQuantity;
    const newTotal = _quantity*req.body.product.price;
    const _productId = req.body.product.id;
 
    Cart.findOne({where:{[Op.and]: [
            {userId: {[Op.like]: _userId} , productId: {[Op.like]: _productId}}]
        }})
    .then((cartItem)=>{
        if(cartItem!==null){
            cartItem.update({quantity:_quantity,total:newTotal})
        }
    })
    .catch((err) => {
        console.log("updateQuantity "+ err.message);
        res.status(500).send({ message: err.message });
    });

};

exports.getCart = async (req,res)=>{
    
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;


    const count = await Cart.count({where:{userId: {[Op.like]: _userId}}});
    const sum = await Cart.sum('total',
    {where:{[Op.and]: [
        {userId: {[Op.like]: _userId} , isChecked: {[Op.like]: true}}]
    }});
    const cartItem = await Cart.findAll({where:{userId: {[Op.like]: _userId}}});

    res.send({count,sum,cartItem});
}

exports.getChecked = async (req,res)=>{
    
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;


    const count = await Cart.count(
        {where:{[Op.and]: [
            {userId: {[Op.like]: _userId} , isChecked: {[Op.like]: true}}]
        }});
    const sum = await Cart.sum('total',
        {where:{[Op.and]: [
            {userId: {[Op.like]: _userId} , isChecked: {[Op.like]: true}}]
        }});
    const cartItem = await Cart.findAll(
        {where:{[Op.and]: [
            {userId: {[Op.like]: _userId} , isChecked: {[Op.like]: true}}]
        }});

    res.send({count,sum,cartItem});
}

exports.removeItem = async (req,res)=>{


    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;

    const _productId = req.params.id;

    const cartItem = await Cart.findOne({where:{[Op.and]: [
        {userId: {[Op.like]: _userId} , productId: {[Op.like]: _productId}}]
    }});

    Cart.destroy({where: {id : cartItem.id}})
    .then(()=>{
        return res.send({ message: "Item Remove" });
    })
    .catch(err=>{
        res.status(500).send({ message: err.message });
    })
}

exports.isChecked = async (req,res)=>{

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;
    const _productId = req.body.id;

 
    Cart.findOne({where:{[Op.and]: [
            {userId: {[Op.like]: _userId} , productId: {[Op.like]: _productId}}]
        }})
    .then((cartItem)=>{
        if(cartItem!==null){
            cartItem.update({isChecked:!cartItem.isChecked})
        }
    })
    .catch((err) => {
        res.status(500).send({ message: err.message });
    });

}

