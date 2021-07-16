module.exports = (sequelize, DataType) => {
    const Wishlist = sequelize.define("wishlist", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        primaryKey: true
      },
    });
  
    return Wishlist;
  };
  