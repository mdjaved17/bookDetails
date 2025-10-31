const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const path = require("path");
const Book = require("./models/book.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/booksDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("index");
});


app.get("/result/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
    const data = await response.json();

    res.render("details", { selectedBook: data });
  } catch (err) {
    console.error("Error fetching book details:", err);
    res.status(500).send("Failed to load book details");
  }
});


app.get("/result", async (req, res) => {
  try {
    const searchQuery = req.query.query; // Or get from req.query.q
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        searchQuery
      )}`
    );
    const data = await response.json();
    console.log("data", data.items);

    const books = data.items; // Get array of books
    res.render("result", { query: searchQuery, books });
    return;
    // res.send(books);
  } catch (err) {
    console.error("❌ Error fetching books:");
    console.log(err);

    res.status(500).send("Error fetching data from Google Books API");
  }
});

// app.get("/fetch-books", async (req, res) => {
//   try {
//     const query = "harry potter"; // tu chahe to dynamic search bhi bana sakta hai
//     const response = await fetch(
//       `https://www.googleapis.com/books/v1/volumes?q=${query}`
//     );
//     const data = await response.json();

//     const books = data.items.map((item) => ({
//       title: item.volumeInfo.title,
//       authors: item.volumeInfo.authors || ["Unknown"],
//       publisher: item.volumeInfo.publisher || "Unknown",
//       publishedDate: item.volumeInfo.publishedDate || "N/A",
//       averageRating: item.volumeInfo.averageRating || 0,
//       ratingsCount: item.volumeInfo.ratingsCount || 0,
//       thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
//     }));

//     await Book.insertMany(books);
//     res.send("📚 Books fetched and stored successfully!");
//   } catch (err) {
//     res.send("❌ Error: " + err.message);
//   }
// });

// 🔹 Display All Books
app.get("/books", async (req, res) => {
  const books = await Book.find({});
  res.render("books", { books });
});

app.listen(8080, () => {
  console.log("port is working");
});
