const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // 1. Extract username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // 2. Check if both username and password are provided
  if (username && password) {
    // 3. Check if the user already exists in the records
    const exists = users.filter((user) => user.username === username);
    
    if (exists.length === 0) {
      // 4. Register the new user
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      // 5. Handle case where username is taken[cite: 1]
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  // 6. Handle missing credentials[cite: 1]
  return res.status(404).json({ message: "Unable to register user: Username or password not provided" });
});

// Get the book list available in the shop using a Promise
public_users.get('/', function (req, res) {
  const fetchBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Unable to load books");
    }
  });

  fetchBooks
    .then((data) => {
      return res.status(200).send(JSON.stringify(data, null, 4));
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const fetchBook = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    fetchBook
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const fetchByAuthor = new Promise((resolve, reject) => {
        const author = req.params.author;
        const keys = Object.keys(books);
        let filtered = keys.filter(key => books[key].author === author).map(key => books[key]);
        
        if (filtered.length > 0) {
            resolve(filtered);
        } else {
            reject("No books found by this author");
        }
    });

    fetchByAuthor
        .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const fetchByTitle = new Promise((resolve, reject) => {
        const title = req.params.title;
        const keys = Object.keys(books);
        let filtered = keys.filter(key => books[key].title === title).map(key => books[key]);

        if (filtered.length > 0) {
            resolve(filtered);
        } else {
            reject("No books found with this title");
        }
    });

    fetchByTitle
        .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // 1. Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // 2. Access the specific book using the ISBN
  const book = books[isbn];

  // 3. Check if the book exists and return its reviews
  if (book) {
    // Return only the reviews object for that specific book
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    // Return a 404 error if the ISBN does not match any book
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
