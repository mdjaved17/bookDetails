const mongoose = require ("mongoose");

const bookschema= new mongoose.Schema({
    title: String,
    id: String,
    authors: [String],
    publisher: String,
    publishDate: String,
    averageRating: String,
    ratingCount: Number,
    thumbnail: String
});

module.exports= mongoose.model("Book", bookschema);



