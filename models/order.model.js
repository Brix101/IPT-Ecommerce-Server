module.exports = (sequelize, DataType) => {
    const Order = sequelize.define("orders", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        primaryKey: true
      },      
      quantity: {
        type: DataType.INTEGER,
        defaultValue:1
      },
      total: {
        type: DataType.DOUBLE
      },
      fullname:{
        type: DataType.STRING
      },
      phonenumber:{
        type: DataType.STRING
      },
      address:{
        type: DataType.STRING
      }
    });
  
    return Order;
  };
  