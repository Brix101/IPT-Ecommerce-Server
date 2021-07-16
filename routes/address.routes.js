const address = require("../controllers/addressController");
const auth = require("../middleware/auth");
var router = require("express").Router();


module.exports = app => {

    router.post("/add",auth , address.add);

    router.get("/",auth, address.getAll);

    router.put("/:id", address.update);

    router.delete("/:id", address.delete);

    router.get("/:id", address.getOneAddress);


    app.use('/api/address', router);
};