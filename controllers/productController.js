const jwt = require("jsonwebtoken");
const db = require("../database");
const Op = db.DataType.Op;

const Product = db.product;
const User = db.user;

exports.create = async (req, res) => {

    if(req.body.name==='undefined'){
        return res.status(409).send({ message: "Please Input Product Product Name" });
    }
    
    if(req.file===undefined){
        return res.status(409).send({ message: "Please Select Product Image" });
    }


        // ? Decode token to Id
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        var _userId = decoded.id  


        //? Create a product
        const product = {
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            price: req.body.price,
            image:"http://localhost:8080/api/image/" + req.file.filename
            };
        Product.create(product)
        .then((_product) => {
            User.findAll({where: {id: _userId}})
            .then((user)=>{
                _product.addUser(user)
                .then(()=>{
                    return res.send({ message: "Product Created" });
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
};

// Retrieve all Products from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Product.findAll({ where: condition })
        .then((data) => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:"Some error occurred while retrieving Products."});
        });
};

// Find a single Product with an id
exports.findOne = (req, res) => {
const id = req.params.id;

    Product.findByPk(id)
    .then(product => {
        // product.getUsers()
        // .then((seller)=>{
        //     res.send({product,seller});
        // })
        res.send(product);
    })
    .catch(err => {
        res.status(500).send({message: "Error retrieving Product with id=" + id});
    });
};

// Update a Product by the id in the request
exports.update = (req, res) => {
const id = req.params.id;

Product.update(req.body, {
    where: { id: id }
})
    .then(num => {
    if (num == 1) {
        res.send({
        message: "Product was updated successfully."
        });
    } else {
        res.send({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
        });
    }
    })
    .catch(err => {
    res.status(500).send({
        message: "Error updating Product with id=" + id
    });
    });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;

Product.destroy({
    where: { id: id }
})
    .then(num => {
    if (num == 1) {
        res.send({
        message: "Product was deleted successfully!"
        });
    } else {
        res.send({
        message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
    }
    })
    .catch(err => {
    res.status(500).send({
        message: "Could not delete Product with id=" + id
    });
    });
};


