const jwt = require("jsonwebtoken");
const db = require("../database");
const Op = db.DataType.Op;

const Order = db.order;
const Cart = db.cart;
const Product = db.product;


exports.create = async (req, res) => {
    // ? Decode token to Id
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id  

    const newOrder = {
        productId: req.body.productId,
        userId: _userId,
        quantity: req.body.quantity,
        total: req.body.total,
        fullname: req.body.fullname,
        phonenumber: req.body.phonenumber,
        address: req.body.address,
        status: "To Pay"
    }

    const cartItem = await Cart.findOne({where:{[Op.and]: [
        {userId: {[Op.like]: _userId} , productId: {[Op.like]: req.body.productId}}]
    }});
    
    const product = await  Product.findByPk(req.body.productId);

    await Order.bulkCreate([newOrder])
        .then(()=>{
            product.update({quantity : product.quantity-req.body.quantity})
            Cart.destroy({where: {id : cartItem.id}})
            .then(()=>{
                return res.send({ message: "Order Placed" });
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).send({ message: err.message });
        });

};

exports.getAllOrder = (req, res) => {
    // ? Decode token to Id
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id  

    Order.findAll({where:{userId: {[Op.like]: _userId}}})
        .then((data) => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:"Some error occurred while retrieving Products."});
        });
};

exports.getAllOrderByStatus = (req, res) => {
    // ? Decode token to Id
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id  

    const status = req.body.status;


    Order.findAll({where:{[Op.and]: [
        {userId: {[Op.like]: _userId} , status: {[Op.like]: status}}]
    }})
        .then((data) => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:"Some error occurred while retrieving Products."});
        });
};

exports.getAllBySeller = (req, res) => {
    const status = req.body.status;
    var condition = status ? { status: { [Op.like]: `%${status}%` } } : null;

    Order.findAll({ where: condition })
        .then((data) => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: err.message});
        });
};

exports.updateStatus = (req, res) => {
    const id = req.params.id;
    Order.update(req.body, {where: { id: id }})
        .then(() => {
            return res.send({ message: "Order Updated" });
        })
        .catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
    });
};