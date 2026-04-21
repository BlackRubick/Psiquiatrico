"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("usuarios", "reset_token", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("usuarios", "reset_token_expiry", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("usuarios", "reset_token");
    await queryInterface.removeColumn("usuarios", "reset_token_expiry");
  },
};
