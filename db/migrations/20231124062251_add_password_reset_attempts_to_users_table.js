const UserModel = require("../models/User");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table(UserModel.tableName, function (table) {
    table.integer("password_reset_attempts");
    table.dateTime("password_reset_last_attempt");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table(UserModel.tableName, function (table) {
    table.dropColumn("password_reset_attempts");
    table.dropColumn("password_reset_last_attempt");
  });
};
