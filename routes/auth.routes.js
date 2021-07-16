const { verifySignUp } = require("../middleware");
const controller = require("../controllers/authController");
var router = require("express").Router();

module.exports = (app)=> {
  app.use((req, res, next) =>{
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/signup",
    [
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkPassword
    ],
    controller.signup
  );

  router.post("/signin", controller.signin);
  router.get("/logout", controller.logout);
  router.get("/loggedIn", controller.loggedIn);

  router.post("/changepassword", controller.changePassword);

  app.use('/api/auth', router);
};