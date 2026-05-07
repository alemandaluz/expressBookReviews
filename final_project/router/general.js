const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
    try {
        // In a real scenario, this would be an external API call
        // Here we simulate the async nature of fetching data
        const getBooks = await Promise.resolve(books);
        res.status(200).send(JSON.stringify(getBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book details based on ISBN using Promises with Axios-like structure
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const fetchBook = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        }, 100);
    });

    fetchBook
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const allBooks = await Promise.resolve(books);
        const keys = Object.keys(allBooks);
        const filteredBooks = keys
            .filter(key => allBooks[key].author === author)
            .map(key => allBooks[key]);

        if (filteredBooks.length > 0) {
            res.status(200).send(JSON.stringify(filteredBooks, null, 4));
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error searching by author" });
    }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const fetchByTitle = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filtered = keys
            .filter(key => books[key].title === title)
            .map(key => books[key]);

        if (filtered.length > 0) resolve(filtered);
        else reject("No books found with this title");
    });

    fetchByTitle
        .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
