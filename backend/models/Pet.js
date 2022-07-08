//IMPORTAR A CONEXÃO
const { Schema } = require('mongoose')
const mongoose = require('../db/conn')

//CRIAR O SCHEMA
const { schema } = mongoose

//CRIAR O MODEL USUARIO
const Pet = mongoose.model(
    'Pet',
    new Schema({
        name:{type:String, required: true},
        weight:{type:Number, required: true},
        color:{type:String, required: true},
        images:{type:Array},
        age:{type:Number, required: true},
        available:{type: Boolean},
        user: Object,
        adopter: Object


    }, {timestamps: true})

)

//EXPOSTAR O MODEL
module.exports = Pet