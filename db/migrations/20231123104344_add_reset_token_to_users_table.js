const UserModel = require("../models/User");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table(UserModel.tableName, function (table) {
    table.string("reset_token");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table(UserModel.tableName, function (table) {
    table.dropColumn("reset_token");
  });
};
