module.exports = (sequelize, DataType) => {
    const Cart = sequelize.define("carts", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        primaryKey: true
      },
      isChecked: {
        type: DataType.BOOLEAN,
        defaultValue:false
      },
      quantity: {
        type: DataType.INTEGER,
        defaultValue:1
      },
      total: {
        type: DataType.DOUBLE
      },
    });
  
    return Cart;
  };
  