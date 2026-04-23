"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("usuarios", "reset_code", {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
    await queryInterface.addColumn("usuarios", "reset_code_expiry", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("usuarios", "reset_code");
    await queryInterface.removeColumn("usuarios", "reset_code_expiry");
  },
};
