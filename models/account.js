module.exports = function(mongoose, properties) {

    'use strict';

    var Crypto = require('crypto');
    var toPassword = function (password) {
        return (Crypto.createHash('sha1')
            .update(password + properties['auth-local-password-salt'])
            .digest('hex'));
    };

    var Schema = mongoose.Schema;
    var Account = new Schema({
        accountType:    String,
        accountId:      String,
        accessToken:    String
    });

    Account.index({accountType: true, accountId: true}, {unique: true});

    Account.statics.Local = function (username, password) {
        return {
            accountType: 'local',
            accountId: username,
            accessToken: toPassword(password)
        };
    };

    Account.options.toJSON = { transform: function(doc, transformed, options) {
        delete transformed.accessToken;
        delete transformed._id;
        delete transformed.__v;
    }};

    return Account;

};
