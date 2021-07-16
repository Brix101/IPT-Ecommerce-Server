const { authJwt } = require("../middleware");
const controller = require("../controllers/userController");

module.exports = (app)=> {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user-access/all", controller.allAccess);

  app.get(
    "/api/user-access/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/user-access/seller",
    [authJwt.verifyToken, authJwt.isSeller],
    controller.moderatorBoard
  );

  app.get(
    "/api/user-access/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};