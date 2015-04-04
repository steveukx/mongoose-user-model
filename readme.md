
# Mongoose User Model

A set of [http://mongoosejs.com/](mongoose) schemas to represent a user with associated accounts. Intended for use with
the [https://github.com/steveukx/express-auth-route](express-auth-route) module.

To allow for creating multiple connections through the same mongoose wrapper for mongo, this module returns Schemas by
default which can then be bound to a connection.

# Usage

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/mygymthing');
    
    var properties = {
        'auth-local-password-salt': 'some-secure-token'
    };
    
    var schemaExtensions = {
        fields: [],  // optional set of fields to add to the user model
        methods: [], // optional array of functions to add as user instance methods
        statics: [], // optional array of functions to add as static user methods
        
        Account: null,  // optionally override the mongoose.Schema used as the Account
        User: null      // will be set to the User schema created 
    };
    
    // returns {Account: mongoose.Schema, User: mongoose.Schema}
    var models = require('mongoose-user-model')(mongoose, properties, schemaExtensions);
    
    var app = require('express')();
    app.use('/auth', 
        require('express-auth-route')(
            properties, 
            mongoose.model(models.User), 
            mongoose.model(models.Account)
        )
    );

