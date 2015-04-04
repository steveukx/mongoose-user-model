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
            schemaExtensions.connection('account', schemaExtensions.AccountSchema = schemaExtensions.Account);

        schemaExtensions.User =
            schemaExtensions.connection('user', schemaExtensions.UserSchema = schemaExtensions.User);
    }

    return {
        user: schemaExtensions.User,
        account: schemaExtensions.Account
    }
};
