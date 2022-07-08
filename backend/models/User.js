//IMPORTAR A CONEXÃO
const { Schema } = require('mongoose')
const mongoose = require('../db/conn')

//CRIAR O SCHEMA
const { schema } = mongoose

//CRIAR O MODEL USUARIO
const User = mongoose.model(
    'User',
    new Schema({
        name:{type:String, required: true},
        email:{type:String, required: true},
        password:{type:String, required: true},
        image:{type:String},
        phone:{type:String, required: true},
    }, {timestamps: true})

)

//EXPOSTAR O MODEL
module.exports = User