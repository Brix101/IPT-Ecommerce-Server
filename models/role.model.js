module.exports = (sequelize, DataType) => {
    const Role = sequelize.define("roles", {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        primaryKey: true
      },
      name: {
        type: DataType.STRING
      }
    });
  
    return Role;
  };