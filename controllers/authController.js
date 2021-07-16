const db = require("../database");
const User = db.user;
const Role = db.role;

const Op = db.DataType.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200)
        .cookie("token",token ,{
          httpOnly: true
        })
        .send({
          firstname :user.firstname,
          lastname :user.lastname, 
          email :user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.changePassword = (req, res) => {

  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);  
  var _userId = decoded.id;

  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (currentPassword===undefined||newPassword===undefined||confirmPassword===undefined) {
    return res.status(403).send({message: "Please Input Password!"});
  }

  User.findOne({where:{id: {[Op.like]: _userId}}})
  .then((user)=>{
      var passwordIsValid = bcrypt.compareSync(
        currentPassword,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(403).send({message: "Incorrect Current Password!"});
      }
      if (newPassword!==confirmPassword) {
        return res.status(403).send({message: "Please Input the Same Password!"});
      }
      //  

      const password = bcrypt.hashSync(newPassword, 8);
      user.update({password: password})
      .then(() => {
          return res.send({message: "Password Updated"});
      })
      .catch(err => {
          console.log(err);
          res.status(500).send({ message: err.message });
      });
    })

};

exports.logout = (req, res) => {
  res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0)
    })
    .send();
};

exports.loggedIn = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);
    res.send(true);
  } catch (err) {
    res.json(false);
  }
};