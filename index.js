const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');
require("dotenv").config();
const db = require("./database");
const Role = db.role;

const app = express();

global.__basedir = __dirname;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname+ "/resources")));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    origin: ["http://localhost:8081"],
    credentials: true,
  })
);


function initial() {
  Role.findAndCountAll()
  .then((res)=>{
    if(res.count===0){
    Role.create({
      id: 1,
      name: "user"
    });
  
    Role.create({
      id: 2,
      name: "seller"
    });
  
    Role.create({
      id: 3,
      name: "admin"
    });
    }
  })
}

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require("./routes/product.routes")(app);
require("./routes/cart.routes")(app);
require("./routes/address.routes")(app);
require("./routes/wishlist.routes")(app);
require("./routes/order.routes")(app);

// to serve images
app.get('/api/image/:product', (req,res)=>{
  res.sendFile(__dirname+`/resources/static/assets/uploads/${req.params.product}`);
});



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  initial();
  console.log(`Server is running on port ${PORT}.`);
});
