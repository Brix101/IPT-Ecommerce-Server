const db = require("../database");
const User = db.user;
const Address = db.address;

const Op = db.DataType.Op;

var jwt = require("jsonwebtoken");

exports.add = (req, res) => {

    // ? Decode token to Id
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id  

    const newAddress = {
        fullname : req.body.fullname,
        phonenumber : req.body.phoneNumber,
        address : req.body.address,
        postalcode : req.body.postalCode,
        streetaddress : req.body.streetAddress,
        userId:_userId
    };


    Address.create(newAddress)
        .then(()=>{
            return res.send({ message: "Address Added" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
};

exports.getAll = (req,res)=>{

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    var _userId = decoded.id;

    Address.findAll({where:{userId : _userId}})
    .then((data) => {
        res.send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
    });
}


exports.getOneAddress = (req,res)=>{
    const id = req.params.id;
  
    Address.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
      });
}

exports.update = (req,res)=>{
    const id = req.params.id;

    const updateAddress = {
        fullname : req.body.fullname,
        phonenumber : req.body.phoneNumber,
        address : req.body.newAddress,
        postalcode : req.body.postalCode,
        streetaddress : req.body.streetAddress,
    };

    Address.update(updateAddress, {where: { id: {[Op.like]: id }}})
        .then(num => {
        if (num == 1) {
            return res.send({message: "Address was updated successfully."});
        } else {
            return res.send({message: `Cannot update Address with id=${id}. Maybe Product was not found or req.body is empty!`});
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
}

exports.delete = (req,res)=>{
    const id = req.params.id;

    Address.destroy({where: { id: {[Op.like]: id }}})
        .then(num => {
        if (num == 1) {
            return res.send({message: "Address was deleted successfully!"});
        } else {
            return res.send({message: `Cannot delete Address with id=${id}. Maybe Address was not found!`});
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
}
