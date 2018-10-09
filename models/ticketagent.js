'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticketagent = sequelize.define('Ticketagent', {
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Ticketagent.associate = function(models) {
    // associations can be defined here
  };
  return Ticketagent;
};