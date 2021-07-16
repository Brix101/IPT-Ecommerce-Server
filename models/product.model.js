module.exports = (sequelize, DataType) => {
    const Product = sequelize.define("products", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        primaryKey: true
      },
      name: {
        type: DataType.STRING,
        require: true
      },
      description: {
        type: DataType.TEXT
      },
      quantity: {
        type: DataType.INTEGER
      },
      price: {
        type: DataType.DOUBLE
      },
      image: {
        type: DataType.STRING
      }
    });
  
    return Product;
  };
  