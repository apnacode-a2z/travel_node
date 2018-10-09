'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Leads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from: {
        type: Sequelize.STRING
      },
      to: {
        type: Sequelize.STRING
      },
      depart: {
        type: Sequelize.DATE
      },
      dreturn: {
        type: Sequelize.DATE
      },
      passengers: {
        type: Sequelize.JSONB
      },
      fullname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
    })
    .then(() =>{
      return queryInterface.addColumn(
        'Leads',
        'PreSalesAgent_id',{
          type: Sequelize.INTEGER,
          references: {
            model: 'PreSalesAgents',
            key: 'id'
          },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
        }
      )
    })
    
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Leads')
    .then(() =>{
      return queryInterface.removeColumn(
        'Leads',
        'PreSalesAgent_id'
      )
    })
  }
};