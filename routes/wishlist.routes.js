const wishlist = require("../controllers/wishlistController");
const auth = require("../middleware/auth");
var router = require("express").Router();


module.exports = (app) => {
    router.get("/", auth , wishlist.getWishlist);

    router.post("/add", auth , wishlist.AddToWishlist);

    app.use('/api/wishlist', router);
};