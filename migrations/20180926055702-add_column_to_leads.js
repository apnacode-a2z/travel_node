'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    queryInterface.addColumn(
      'Leads',
      'send_quote',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    queryInterface.removeColumn(
      'Leads',
      'send_quote'
    );
  }
};
