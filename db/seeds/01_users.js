const UserModel = require('../models/User');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(UserModel.tableName).del();

  await knex(UserModel.tableName).insert([
    {
      first_name: 'Miss Verla',
      last_name: ' Johns I',
      email: 'kstanton@kassulke.com',
      password: '12345678',
      phone_number: '+1  517-588-7773',
    },
    {
      first_name: 'Mr. Stewart',
      last_name: 'Stiedemann',
      email: 'shanie.greenfelder@yahoo.com',
      password: '12345678',
      phone_number: '+1  972-780-3965',
    },
    {
      first_name: 'Tristin',
      last_name: 'Grimes',
      email: 'nitzsche.orrin@hotmail.com',
      password: '12345678',
      phone_number: '+1  832-254-8919',
    },
  ]);
};
