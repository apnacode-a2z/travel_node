'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define('Lead', {
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    depart: DataTypes.DATE,
    dreturn: DataTypes.DATE,
    passengers: DataTypes.JSONB,
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    send_quote: DataTypes.BOOLEAN,
    approved_quote: DataTypes.BOOLEAN
  }, {});
  Lead.associate = function(models) {
    // associations can be defined here
    Lead.belongsTo(models.PreSalesAgent, {foreignKey: 'PreSalesAgent_id' });
  };
  return Lead;
};