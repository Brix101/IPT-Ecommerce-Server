const order = require("../controllers/orderController");
const auth = require("../middleware/auth");
var router = require("express").Router();

module.exports = app => {

    router.post("/create", auth, order.create);

    router.get("/order", auth, order.getAllOrder);

    router.post("/status", auth, order.getAllOrderByStatus);

    router.post("/seller", auth, order.getAllBySeller);

    router.put("/:id", auth, order.updateStatus);

    app.use('/api/order', router);
};