module.exports = (sequelize, DataType) => {
    const Address = sequelize.define("addresses", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        primaryKey: true
      },
      fullname: {
        type: DataType.STRING,
      },
      phonenumber: {
        type: DataType.STRING
      },
      address: {
        type: DataType.STRING
      },
      postalcode: {
        type: DataType.INTEGER
      },
      streetaddress:{
          type: DataType.STRING
      }
    });
  
    return Address;
  };
  