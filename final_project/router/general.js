const express = require('express');
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // 1. Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // 2. Access the book object using the ISBN key from booksdb.js
  const book = books[isbn];

  // 3. Check if the book exists and return the response
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 // 1. Retrieve the title from the request parameters
 const author = req.params.author;
  
  // 2. Obtain all the keys for the 'books' object from booksdb.js[cite: 1, 3]
  const keys = Object.keys(books);
  
  // 3. Initialize an array to store matches
  let filtered_books = [];

  // 4. Iterate through the books object to find the matching title[cite: 1, 3]
  keys.forEach((key) => {
    if (books[key].author === author) {
      filtered_books.push(books[key]);
    }
  });

  // 5. If books are found, return them with status 200 (Success)
  if (filtered_books.length > 0) {
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } else {
    // If no match is found, return a 404 error
    return res.status(404).json({ message: "No books found with this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // 1. Retrieve the title from the request parameters
  const title = req.params.title;
  
  // 2. Obtain all the keys for the 'books' object
  const keys = Object.keys(books);
  
  // 3. Initialize an array to store matching books
  let filtered_books = [];

  // 4. Iterate through the books object using the keys
  keys.forEach((key) => {
    // Check if the title of the current book matches the requested title
    if (books[key].title === title) {
      filtered_books.push(books[key]);
    }
  });

  // 5. Return the result[cite: 1]
  if (filtered_books.length > 0) {
    // Use status 200 for a successful retrieval[cite: 1]
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } else {
    // Return 404 if no book with that title exists
    return res.status(404).json({ message: "No books found with this title" });
  }
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
