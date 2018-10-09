'use strict';
module.exports = (sequelize, DataTypes) => {
  const PreSalesAgent = sequelize.define('PreSalesAgent', {
    Name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  PreSalesAgent.associate = function(models) {
     PreSalesAgent.hasMany(models.Lead, {foreignKey: 'PreSalesAgent_id' });
  };
  return PreSalesAgent;
};