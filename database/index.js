const DataType = require("sequelize");


const sequelize = new DataType(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,                        //? Disables logging
  }
);

// sequelize.sync();
// sequelize.sync({force: true});
sequelize.sync({alter:true});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const db = {};

db.DataType = DataType;

db.user = require("../models/user.model")(sequelize, DataType);
db.role = require("../models/role.model")(sequelize, DataType);
db.product = require("../models/product.model")(sequelize, DataType);
db.cart = require("../models/cart.model")(sequelize, DataType);
db.address = require("../models/address.model")(sequelize, DataType);
db.order = require("../models/order.model")(sequelize, DataType);
db.wishlish = require("../models/wishlish.model")(sequelize, DataType);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.product.belongsToMany(db.user, {
  through: "product_seller",
  foreignKey: "productId",
  otherKey: "userId"
});
db.user.belongsToMany(db.product, {
  through: "product_seller",
  foreignKey: "userId",
  otherKey: "productId"
});

db.product.belongsToMany(db.user, {
  through: db.cart,
  foreignKey: "productId",
  otherKey: "userId"
});
db.user.belongsToMany(db.product, {
  through: db.cart,
  foreignKey: "userId",
  otherKey: "productId"
});

db.product.belongsToMany(db.user, {
  through: db.order,
  foreignKey: "productId",
  otherKey: "userId"
});
db.user.belongsToMany(db.product, {
  through: db.order,
  foreignKey: "userId",
  otherKey: "productId"
});

db.user.hasMany(db.address);



db.product.belongsToMany(db.user, {
  through: db.wishlish,
  foreignKey: "productId",
  otherKey: "userId"
});
db.user.belongsToMany(db.product, {
  through: db.wishlish,
  foreignKey: "userId",
  otherKey: "productId"
});



db.ROLES = ["user", "admin", "seller"];
// db.ROLES = ["user", "admin", "seller"];

module.exports = db;
