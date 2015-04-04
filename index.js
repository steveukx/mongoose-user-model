'use strict';

module.exports = function (mongoose, properties, schemaExtensions) {
    if (!schemaExtensions) {
        schemaExtensions = {};
    }

    if (!schemaExtensions.Account) {
        schemaExtensions.Account = require('./models/account')(mongoose, properties);
    }

    schemaExtensions.User = require('./models/user')(mongoose, properties, schemaExtensions);

    return {
        user: schemaExtensions.User,
        account: schemaExtensions.Account
    }
};
