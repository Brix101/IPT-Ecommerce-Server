const cart = require("../controllers/cartController");
const auth = require("../middleware/auth");
var router = require("express").Router();

module.exports = app => {

    router.post("/add",auth , cart.addItem);

    router.post("/updatequantity",auth , cart.updateQuantity);

    router.post("/checked",auth , cart.isChecked);

    router.get("/",auth, cart.getCart);

    router.get("/checked",auth, cart.getChecked);

    // router.get("/:id", product.findOne);

    // router.put("/:id", product.update);

    router.delete("/:id", cart.removeItem);


    app.use('/api/cart', router);
};