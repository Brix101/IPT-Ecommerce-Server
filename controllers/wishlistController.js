const jwt = require('jsonwebtoken');
const db = require('../database');
const Op = db.DataType.Op;

const Wishlist = db.wishlish;
const Cart = db.cart;

exports.AddToWishlist = async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;

    const _productId = req.body.id;

    const newWishlist = {
        productId: _productId,
        userId:_userId
    }

    Wishlist.findOne({where:{[Op.and]: [
        {userId: {[Op.like]: _userId} , productId: {[Op.like]: _productId}}]
    }})
    .then((wishlist)=>{
        if(wishlist===null){

            Cart.findOne({where:{[Op.and]: [
                    {userId: {[Op.like]: _userId} , productId: {[Op.like]: _productId}}]
                }})
            .then((cartItem)=>{
                if(cartItem!==null){
                    Cart.destroy({where: {id : cartItem.id}});
                }
            })

            Wishlist.create(newWishlist)
            .then(()=>{
                return res.send({message:"Added to Wishlist"});
            })
        }else{
            return res.send({message:"Already on the Wishlist"});
        }
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    });
};

exports.getWishlist = async (req,res)=>{
    
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;


    Wishlist.findAll({where:{userId: {[Op.like]: _userId}}})
    .then((wishlist)=>{
        res.send(wishlist);
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    });

}