'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
      return queryInterface.bulkInsert('PreSalesAgents', [{
        Name:"unassigned",
        email: "unassigned@gmail.com",
        password: "unassigned",
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('PreSalesAgents', null, {});
  }
};
