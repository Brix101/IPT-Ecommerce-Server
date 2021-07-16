const product = require("../controllers/productController");
const imageUpload = require("../middleware/imageUpload");
var router = require("express").Router();

module.exports = app => {

    // Create a new Tutorial
    router.post("/create", imageUpload.single("image"), product.create);

    // Retrieve all Tutorials
    router.get("/products", product.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", product.findOne);

    // Update a Tutorial with id
    router.put("/:id", product.update);

    // Delete a Tutorial with id
    router.delete("/:id", product.delete);


    app.use('/api/product', router);
};