const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// The base URL where your server is running
const BASE_URL = "http://localhost:5000";

// Task 10: Get the book list available in the shop using Async/Await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Axios makes an HTTP request to get the data
        const response = await axios.get(`${BASE_URL}/books`); 
        res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book list", error: error.message });
    }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    axios.get(`${BASE_URL}/books`)
        .then((response) => {
            const booksList = response.data;
            if (booksList[isbn]) {
                res.status(200).send(JSON.stringify(booksList[isbn], null, 4));
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching book by ISBN" });
        });
});

// Task 12: Get book details based on author using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        const allBooks = response.data;
        const filteredBooks = Object.values(allBooks).filter(b => b.author === author);

        if (filteredBooks.length > 0) {
            res.status(200).send(JSON.stringify(filteredBooks, null, 4));
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error searching by author" });
    }
});

// Task 13: Get all books based on title using Promises with Axios
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    axios.get(`${BASE_URL}/books`)
        .then((response) => {
            const allBooks = response.data;
            const filtered = Object.values(allBooks).filter(b => b.title === title);
            
            if (filtered.length > 0) {
                res.status(200).send(JSON.stringify(filtered, null, 4));
            } else {
                res.status(404).json({ message: "No books found with this title" });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Error searching by title" });
        });
});

// Helper route to provide data to Axios calls (Simulating a DB/API)
public_users.get('/books', (req, res) => {
    res.send(JSON.stringify(books));
});

module.exports.general = public_users;
