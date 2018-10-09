'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Customers', [{
        UserName: 'john',
        email: "john@gmail.com",
        password: "john",
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkDelete('Customers', null, {});
    
  }
};
