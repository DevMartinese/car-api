'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = Schema({
    brand: String,
    model: String,
    category: {type: String, enum: ['Todos', 'Autos', 'Pickups y Comerciales', 'SUVs y Crossovers']},
    price: Number,
    year: Number,
    image: String
})

module.exports = mongoose.model('Article', ArticleSchema);
