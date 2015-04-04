module.exports = function(mongoose, properties, schemaExtensions) {

    'use strict';

    var Schema = mongoose.Schema;
    var Account = schemaExtensions && schemaExtensions.Account || require('./account')(mongoose, properties);
    var Promise = require('es6-promise').Promise;

    var userSchemaFields = {
        accounts: [Account],
        firstName: String,
        lastName: String,
        gender: String,
        dateOfBirth: Date
    };

    if (schemaExtensions && schemaExtensions.fields) {
        for (var field in schemaExtensions.fields) {
            if (schemaExtensions.fields.hasOwnProperty(field)) {
                if (!userSchemaFields[field]) {
                    userSchemaFields[field] = schemaExtensions.fields[field];
                }
                else {
                    throw "User schema field " + field + " cannot be overridden.";
                }
            }
        }
    }

    var User = new Schema(userSchemaFields);

    User.methods.addAccount = function(accountType, accountId, accessToken) {
        var user = this;

        this.accounts.push(new Account({
            type: accountType,
            id: accountId,
            accessToken: accessToken
        }));

        return new Promise(function (resolve, reject) {
            user.save(function (err, update) {
                err ? reject(err) : resolve(user);
            });
        });
    };

    User.methods.accountByType = function (accountType) {
        return this.accounts.filter(function (account) {
            return account.accountType === accountType
        }).shift();
    };

    User.statics.findOrCreate = function(accountType, accountId, accessToken, profileData) {
        var resolve, reject;
        this.findOneAndUpdate({
                'accounts.accountType': accountType,
                'accounts.accountId': accountId
            },
            profileData,
            {
                upsert: true
            },
            function (err, user) {
                user.accountByType(accountType).accessToken = accessToken;
                user.save(function (err, user) {
                    err ? reject(err) : resolve(user);
                });
            }
        );

        return new Promise(function (_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
    };

    User.statics.findLocal = function (username, password, onDone) {
        var account = this.model('account').Local(username, password);
        this.findOne({
            'accounts.accountType': account.accountType,
            'accounts.accountId': account.accountId
        }, function (err, user) {
            if (!err && !user) {
                err = new Error("Invalid User");
            }
            if (!err && user && user.accounts[0].accessToken != account.accessToken) {
                err = new Error("Invalid Password");
            }

            onDone(err, !err && user || null);
        });
    };

    'methods statics'.split(' ').forEach(function (extension) {
        if (schemaExtensions && schemaExtensions[extension]) {
            for (var ext in schemaExtensions[extension]) {
                if (schemaExtensions[extension].hasOwnProperty(ext)) {
                    if (!User[extension][ext]) {
                        User[extension][ext] = schemaExtensions[extension][ext];
                    }
                    else {
                        throw "User schema " + extension + " cannot override built-in " + ext;
                    }
                }
            }
        }
    });

    return User;

};
