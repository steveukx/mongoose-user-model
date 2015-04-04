'use strict';

module.exports = function (mongoose, properties, schemaExtensions) {
    if (!schemaExtensions) {
        schemaExtensions = {};
    }

    if (!schemaExtensions.Account) {
        schemaExtensions.Account = require('./models/account')(mongoose, properties);
    }

    schemaExtensions.User = require('./models/user')(mongoose, properties, schemaExtensions);

    if (schemaExtensions.connection) {
        schemaExtensions.Account =
            schemaExtensions.connection.model('account', schemaExtensions.AccountSchema = schemaExtensions.Account);

        schemaExtensions.User =
            schemaExtensions.connection.model('user', schemaExtensions.UserSchema = schemaExtensions.User);
    }

    return {
        User: schemaExtensions.User,
        Account: schemaExtensions.Account
    }
};
