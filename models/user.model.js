module.exports = (sequelize, DataType) => {
  const User = sequelize.define("users", {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true
    },
    firstname: {
      type: DataType.STRING,
      require: true
    },
    lastname: {
      type: DataType.STRING,
      require: true
    },
    email: {
      type: DataType.STRING,
      require: true
    },
    password: {
      type: DataType.STRING
    },
  });

  return User;
};